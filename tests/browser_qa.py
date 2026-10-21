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
    expect(page.locator('.connection-hero')).to_have_class('connection-hero connection-ready')
    expect(page.get_by_role('heading', level=1)).to_have_accessible_name('Fakhri Rasyid Saputro')
    expect(page.locator('#connection-art')).to_be_visible()
    assert page.locator('.connection-hero').bounding_box()['height'] <= 1000
    page.wait_for_timeout(2500)  # Deliberate settling interval; verify idle simulation stops.
    before = page.locator('#connection-art').screenshot()
    page.wait_for_timeout(200)
    assert before == page.locator('#connection-art').screenshot(), 'Idle cable did not stop'
    page.screenshot(path=str(OUT / 'desktop.png'), animations='disabled')
    page.locator('.connection-action').click()
    expect(page.locator('.connection-hero')).to_have_attribute('data-connected', 'true')
    expect(page.locator('.connection-status')).to_have_text('Connected')
    page.wait_for_timeout(2500)
    page.screenshot(path=str(OUT / 'connected.png'), animations='disabled')
    page.locator('.connection-action').focus()
    page.keyboard.press('Enter')
    expect(page.locator('.connection-hero')).to_have_attribute('data-connected', 'false')
    page.wait_for_timeout(2000)
    # Exercise the actual pointer drag, not just the accessible click alternative.
    plug = page.locator('.cable-plug').bounding_box()
    socket = page.locator('.cable-socket').bounding_box()
    page.mouse.move(plug['x'] + plug['width']/2, plug['y'] + plug['height']/2)
    page.mouse.down()
    page.mouse.move(socket['x'] + socket['width']/2, socket['y'] + socket['height']/2, steps=20)
    page.mouse.up()
    expect(page.locator('.connection-hero')).to_have_attribute('data-connected', 'true')
    page.keyboard.press('Escape')
    expect(page.locator('.connection-hero')).to_have_attribute('data-connected', 'false')
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
    print('PASS: cable idle, click/keyboard connect, actual drag/drop, Escape, menu, inspect, theme, search, archive, details')

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
                page.locator('.connection-action').click()
                expect(page.locator('.connection-hero')).to_have_attribute('data-connected', 'true')
                page.wait_for_timeout(2000)
                page.screenshot(path=str(OUT / 'mobile-connected.png'), animations='disabled')
    print('PASS: 35 responsive route/width checks; mobile menu and Escape')

    reduced = browser.new_page(reduced_motion='reduce', viewport={'width': 390, 'height': 844})
    reduced.goto(BASE)
    reduced.locator('.connection-action').click()
    expect(reduced.locator('.connection-hero')).to_have_attribute('data-connected', 'true')
    frozen = reduced.locator('#connection-art').screenshot()
    reduced.mouse.move(150, 450)
    assert frozen == reduced.locator('#connection-art').screenshot(), 'Reduced motion artwork moved'
    assert reduced.locator('.will-reveal').count() == 0
    nojs = browser.new_page(java_script_enabled=False, viewport={'width': 390, 'height': 844})
    nojs.goto(BASE)
    expect(nojs.locator('h1')).to_be_visible()
    expect(nojs.locator('.connection-work')).to_be_visible()
    assert not nojs.evaluate('document.documentElement.scrollWidth > innerWidth'), 'No-JS header overflow'
    assert nojs.locator('.featured-card').count() == 4
    nojs.goto(BASE + '/projects/')
    assert nojs.locator('#project-grid .project-card:visible').count() == 50
    print('PASS: reduced-motion controls and no-JavaScript content')
    touch = browser.new_page(viewport={'width': 390, 'height': 844}, is_mobile=True, has_touch=True)
    touch.goto(BASE)
    touch.locator('.cable-plug').tap()
    expect(touch.locator('.connection-hero')).to_have_attribute('data-connected', 'true')
    touch.locator('.connection-action').tap()
    expect(touch.locator('.connection-hero')).to_have_attribute('data-connected', 'false')
    touch.locator('.connection-work').tap()
    expect(touch).to_have_url(BASE + '/#work')
    print('PASS: touch tap connect/disconnect and direct project-section navigation')
    assert not errors, errors
    print('PASS: no JavaScript runtime errors')
    browser.close()
