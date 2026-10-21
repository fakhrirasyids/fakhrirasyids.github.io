/* Run before paint. Failure to access storage must never block the page. */
try {
  var storedTheme = localStorage.getItem('frs-theme');
  document.documentElement.dataset.theme = storedTheme === 'light' || storedTheme === 'dark'
    ? storedTheme : (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
} catch (_) { /* The default light theme remains usable. */ }
