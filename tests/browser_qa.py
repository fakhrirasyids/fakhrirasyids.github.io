"""Optional rendered QA; uses an existing Playwright installation, not a site dependency.

Run a static server on 8001, then: python3 tests/browser_qa.py
Screenshots are written outside the repository to /private/tmp/frs-qa.
"""
from pathlib import Path
from playwright.sync_api import sync_playwright, expect

OUT = Path('/private/tmp/frs-qa')
OUT.mkdir(exist_ok=True)
BASE = 'http://127.0.0.1:8001'

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page(viewport={'width': 1440, 'height': 1000}, device_scale_factor=1)
    errors = []
    page.on('pageerror', lambda error: errors.append(str(error)))
    page.goto(BASE)
    expect(page.locator('.assembly-hero')).to_have_class('assembly-hero assembly-ready')
    expect(page.get_by_role('heading', level=1)).to_have_accessible_name('Fakhri Rasyid Saputro')
    expect(page.locator('.assembly-photo')).to_be_visible()
    expect(page.locator('.assembly-work')).to_be_visible()
    expect(page.locator('.assembly-cv')).to_be_visible()
    assert page.locator('.assembly-hero').bounding_box()['height'] <= 1000
    assert not page.locator('.assembly-hero.is-running').count(), 'Animation running on arrival'
    with page.expect_download() as download_info:
        page.locator('.assembly-cv').click()
    assert download_info.value.suggested_filename.endswith('.pdf')
    assert download_info.value.failure() is None
    page.screenshot(path=str(OUT / 'desktop.png'), animations='disabled')
    page.locator('.assembly-toggle').click()
    expect(page.locator('.assembly-hero')).to_have_attribute('data-mode', 'loose')
    page.wait_for_timeout(5500)
    assert page.locator('.assembly-hero.is-running').count() == 0
    before = page.locator('.assembly-board').screenshot()
    page.wait_for_timeout(200)
    assert before == page.locator('.assembly-board').screenshot(), 'Idle assembly did not stop'
    page.screenshot(path=str(OUT / 'scattered.png'), animations='disabled')
    page.locator('.assembly-toggle').focus()
    page.keyboard.press('Enter')
    expect(page.locator('.assembly-hero')).to_have_attribute('data-mode', 'built')
    page.wait_for_timeout(1700)
    piece = page.locator('[data-piece]').first
    original_transform = piece.get_attribute('style')
    # Actual drag/throw and keyboard rebuild.
    box = piece.bounding_box()
    page.mouse.move(box['x'] + box['width']/2, box['y'] + box['height']/2)
    page.mouse.down()
    page.mouse.move(box['x'] + box['width']/2 + 130, box['y'] + box['height']/2 - 50, steps=12)
    page.mouse.up()
    expect(page.locator('.assembly-hero')).to_have_attribute('data-mode', 'loose')
    assert piece.get_attribute('style') != original_transform
    expect(piece).to_have_attribute('aria-pressed', 'false')
    page.keyboard.press('Escape')
    expect(page.locator('.assembly-hero')).to_have_attribute('data-mode', 'built')
    page.wait_for_timeout(1700)
    assert piece.get_attribute('style') == original_transform
    # Roving focus, keyboard pickup, movement and placement.
    piece.focus()
    page.keyboard.press('ArrowRight')
    expect(page.locator('[data-piece]').nth(1)).to_be_focused()
    page.keyboard.press('Enter')
    expect(page.locator('[data-piece]').nth(1)).to_have_attribute('aria-pressed', 'true')
    page.keyboard.press('ArrowUp')
    page.keyboard.press('Enter')
    expect(page.locator('[data-piece]').nth(1)).to_have_attribute('aria-pressed', 'false')
    page.keyboard.press('Escape')
    page.wait_for_timeout(1700)
    # Click-pick / click-place alternative to drag.
    piece.click()
    expect(piece).to_have_attribute('aria-pressed', 'true')
    board = page.locator('.assembly-board').bounding_box()
    page.mouse.click(board['x'] + 30, board['y'] + 30)
    expect(piece).to_have_attribute('aria-pressed', 'false')
    page.locator('.assembly-toggle').click()
    page.wait_for_timeout(1700)
    page.get_by_role('button', name='Menu', exact=False).click()
    expect(page.locator('#site-nav')).to_be_visible()
    page.get_by_role('button', name='Dark theme').click()
    expect(page.locator('html')).to_have_attribute('data-theme', 'dark')
    page.screenshot(path=str(OUT / 'dark-menu.png'), animations='disabled')
    page.get_by_role('button', name='Dark theme').click()
    page.get_by_role('button', name='Find a project', exact=True).click()
    page.locator('#command-search').fill('DICOM')
    expect(page.locator('#command-results')).to_contain_text('8xray')
    page.keyboard.press('Escape')
    expect(page.locator('#search-dialog')).not_to_be_visible()
    expect(page.get_by_role('button', name='Find a project', exact=True)).to_be_focused()
    page.keyboard.press('Escape')
    page.locator('#work').scroll_into_view_if_needed()
    for card in page.locator('.featured-card').all():
        card.scroll_into_view_if_needed()
        expect(card).to_have_css('opacity', '1')
        expect(card.locator('img')).to_have_js_property('complete', True)
    page.locator('#work').screenshot(path=str(OUT / 'work-section.png'), animations='disabled')
    page.locator('#work').scroll_into_view_if_needed()
    page.screenshot(path=str(OUT / 'work.png'), animations='disabled')
    page.locator('#about').scroll_into_view_if_needed()
    expect(page.locator('.about-copy')).to_have_css('opacity', '1')
    expect(page.locator('.about-portrait img')).to_have_js_property('complete', True)
    page.screenshot(path=str(OUT / 'about.png'), animations='disabled')
    page.get_by_role('button', name='Inspect mode').click()
    expect(page.locator('html')).to_have_class('js inspect')
    page.get_by_role('button', name='Inspect mode').click()
    page.goto(BASE + '/projects/')
    page.locator('#project-search').fill('8xray')
    expect(page.locator('#result-count')).to_contain_text('1 of 1')
    expect(page.locator('#project-grid .project-card:visible')).to_have_count(1)
    page.locator('#project-grid .project-card:visible .project-link').click()
    expect(page.locator('h1')).to_have_text('8xray App')
    page.screenshot(path=str(OUT / 'project.png'), animations='disabled')
    page.goto(BASE + '/projects/')
    page.locator('#load-more').click()
    expect(page.locator('#project-grid .project-card:visible')).to_have_count(24)
    page.locator('#project-search').fill('not-a-real-project-xyz')
    expect(page.locator('#empty-results')).to_be_visible()
    page.locator('#project-filters button[type=reset]').click()
    expect(page.locator('#project-grid .project-card:visible')).to_have_count(12)
    print('PASS: CV download, idle stop, scatter/rebuild, actual drag/throw, keyboard and click-place, Escape, menu, inspect, theme, search, archive, details')

    for width in [320, 390, 768, 1024, 1440]:
        page.set_viewport_size({'width': width, 'height': 900})
        for route in ['/', '/id/', '/zh/', '/projects/', '/experience/', '/articles/', '/projects/8xray-app/']:
            page.goto(BASE + route)
            overflow = page.evaluate('document.documentElement.scrollWidth > innerWidth')
            assert not overflow, f'Horizontal overflow at {width}: {route}'
            if route == '/' and width == 390:
                page.screenshot(path=str(OUT / 'mobile.png'), animations='disabled')
                page.get_by_role('button', name='Menu').click()
                expect(page.locator('#site-nav')).to_be_visible()
                page.keyboard.press('Escape')
                expect(page.locator('#site-nav')).not_to_be_visible()
                page.locator('.assembly-toggle').click()
                expect(page.locator('.assembly-hero')).to_have_attribute('data-mode', 'loose')
                page.wait_for_timeout(5500)
                page.screenshot(path=str(OUT / 'mobile-scattered.png'), animations='disabled')
            if route in ['/', '/id/', '/zh/']:
                expect(page.locator('.assembly-cv')).to_be_visible()
                expect(page.locator('.assembly-work')).to_be_visible()
    print('PASS: 35 responsive route/width checks; mobile menu and Escape')

    page.goto(BASE)
    expect(page.locator('.assembly-toggle')).to_be_visible()
    page.locator('.assembly-toggle').click()
    page.set_viewport_size({'width': 768, 'height': 900})
    expect(page.locator('.assembly-hero')).to_have_attribute('data-mode', 'built')
    page.locator('.assembly-toggle').click()
    page.locator('#work').scroll_into_view_if_needed()
    expect(page.locator('.assembly-hero.is-running')).to_have_count(0)
    page.locator('.assembly-toggle').scroll_into_view_if_needed()
    page.emulate_media(reduced_motion='reduce')
    expect(page.locator('.assembly-hero')).to_have_attribute('data-mode', 'built')
    expect(page.locator('.assembly-hero.is-running')).to_have_count(0)
    page.emulate_media(reduced_motion='no-preference')
    print('PASS: resize recovery, offscreen pause and live reduced-motion changes')

    reduced = browser.new_page(reduced_motion='reduce', viewport={'width': 390, 'height': 844})
    reduced.on('pageerror', lambda error: errors.append(str(error)))
    reduced.goto(BASE)
    reduced.locator('.assembly-toggle').click()
    expect(reduced.locator('.assembly-hero')).to_have_attribute('data-mode', 'loose')
    frozen = reduced.locator('.assembly-board').screenshot()
    reduced.wait_for_timeout(300)
    assert frozen == reduced.locator('.assembly-board').screenshot(), 'Reduced motion artwork moved'
    assert reduced.locator('.assembly-hero.is-running').count() == 0
    reduced.locator('.assembly-toggle').click()
    expect(reduced.locator('.assembly-hero')).to_have_attribute('data-mode', 'built')
    assert reduced.locator('.will-reveal').count() == 0
    nojs = browser.new_page(java_script_enabled=False, viewport={'width': 390, 'height': 844})
    nojs.goto(BASE)
    expect(nojs.locator('h1')).to_be_visible()
    expect(nojs.locator('.assembly-work')).to_be_visible()
    expect(nojs.locator('.assembly-cv')).to_be_visible()
    expect(nojs.locator('.assembly-toggle')).not_to_be_visible()
    assert not nojs.evaluate('document.documentElement.scrollWidth > innerWidth'), 'No-JS header overflow'
    assert nojs.locator('.featured-card').count() == 4
    nojs.goto(BASE + '/projects/')
    assert nojs.locator('#project-grid .project-card:visible').count() == 50
    print('PASS: reduced-motion controls and no-JavaScript content')
    touch = browser.new_page(viewport={'width': 390, 'height': 844}, is_mobile=True, has_touch=True)
    touch.on('pageerror', lambda error: errors.append(str(error)))
    touch.goto(BASE)
    expect(touch.locator('.assembly-hero')).to_have_class('assembly-hero assembly-ready')
    touch.locator('[data-piece]').first.tap()
    expect(touch.locator('[data-piece]').first).to_have_attribute('aria-pressed', 'true')
    expect(touch.locator('.assembly-hint')).to_have_text('Tap a new spot to place it.')
    board = touch.locator('.assembly-board').bounding_box()
    touch.touchscreen.tap(board['x'] + 30, board['y'] + 30)
    expect(touch.locator('[data-piece]').first).to_have_attribute('aria-pressed', 'false')
    touch.locator('.assembly-toggle').tap()
    expect(touch.locator('.assembly-hero')).to_have_attribute('data-mode', 'built')
    touch.locator('.assembly-work').tap()
    expect(touch).to_have_url(BASE + '/#work')
    print('PASS: touch pickup, place, rebuild and direct project-section navigation')

    # Normal touch scrolling remains available outside draggable pieces.
    touch.goto(BASE)
    expect(touch.locator('.assembly-toggle')).to_be_visible()
    assert touch.locator('.assembly-board').evaluate('el => getComputedStyle(el).touchAction') == 'auto'
    assert touch.locator('[data-piece]').first.evaluate('el => getComputedStyle(el).touchAction') == 'none'
    assert not errors, errors
    print('PASS: no JavaScript runtime errors')
    browser.close()
