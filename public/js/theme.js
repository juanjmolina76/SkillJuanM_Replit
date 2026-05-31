// Theme toggle functionality
(function() {
  // Check for saved theme preference or default to light
  const currentTheme = localStorage.getItem('theme') || 'light';
  
  // Apply saved theme on load
  if (currentTheme === 'dark') {
    enableDarkMode();
  }

  function enableDarkMode() {
    const link = document.querySelector('link[rel="stylesheet"]');
    if (link) {
      // Replace light CSS with dark CSS
      const darkLink = document.createElement('link');
      darkLink.rel = 'stylesheet';
      darkLink.type = 'text/css';
      darkLink.href = link.href.replace('style.css', 'style-dark.css');
      
      // Remove old stylesheet and add dark one
      link.parentNode.removeChild(link);
      document.head.appendChild(darkLink);
    }
    
    // Update body style for background
    document.body.style.backgroundColor = '#000000';
    
    // Update button icon
    updateToggleButton('dark');
    
    // Save preference
    localStorage.setItem('theme', 'dark');
  }

  function enableLightMode() {
    const link = document.querySelector('link[rel="stylesheet"]');
    if (link) {
      // Replace dark CSS with light CSS
      const lightLink = document.createElement('link');
      lightLink.rel = 'stylesheet';
      lightLink.type = 'text/css';
      lightLink.href = link.href.replace('style-dark.css', 'style.css');
      
      // Remove old stylesheet and add light one
      link.parentNode.removeChild(link);
      document.head.appendChild(lightLink);
    }
    
    // Remove body background override
    document.body.style.backgroundColor = '';
    
    // Update button icon
    updateToggleButton('light');
    
    // Save preference
    localStorage.setItem('theme', 'light');
  }

  function updateToggleButton(mode) {
    const btn = document.getElementById('theme-toggle');
    if (btn) {
      if (mode === 'dark') {
        btn.innerHTML = '<span title="Modo claro">&#9728;</span>'; // Sun
        btn.title = 'Cambiar a modo claro';
      } else {
        btn.innerHTML = '<span title="Modo oscuro">&#9790;</span>'; // Moon
        btn.title = 'Cambiar a modo oscuro';
      }
    }
  }

  // Toggle function exposed globally
  window.toggleTheme = function() {
    const currentTheme = localStorage.getItem('theme') || 'light';
    if (currentTheme === 'light') {
      enableDarkMode();
    } else {
      enableLightMode();
    }
  };

  // Initialize button on page load
  document.addEventListener('DOMContentLoaded', function() {
    // Create toggle button if it doesn't exist
    if (!document.getElementById('theme-toggle')) {
      const btn = document.createElement('button');
      btn.id = 'theme-toggle';
      btn.className = 'theme-toggle';
      btn.onclick = window.toggleTheme;
      document.body.appendChild(btn);
    }
    
    // Set correct icon based on current theme
    const theme = localStorage.getItem('theme') || 'light';
    updateToggleButton(theme);
  });
})();