(() => {
  try {
    const savedTheme = localStorage.getItem('site_theme');
    const theme = savedTheme === 'light' || savedTheme === 'dark'
      ? savedTheme
      : (matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
    document.documentElement.dataset.theme = theme;
  } catch {
    document.documentElement.dataset.theme = 'dark';
  }
})();
