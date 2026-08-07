(() => {
  const root = document.documentElement;
  let storedTheme = null;

  try {
    storedTheme = localStorage.getItem('darkMode');
  } catch {
    // Storage may be unavailable in privacy-restricted browsing contexts.
  }

  const darkMode = storedTheme === 'enabled'
    || (storedTheme !== 'disabled' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  root.classList.remove(darkMode ? 'light' : 'dark');
  root.classList.add(darkMode ? 'dark' : 'light');
  root.style.colorScheme = darkMode ? 'dark' : 'light';
  root.dataset.themeInitialized = 'true';
})();
