document.addEventListener("DOMContentLoaded", () => {
  const settingsBtn = document.querySelector('.settings-btn');
  const settingsPanel = document.querySelector('.settings-panel');
  const darkModeToggle = document.getElementById('darkModeToggle');
  const iframe = document.getElementById('content-frame');

  // Settings panel toggle
  settingsBtn.addEventListener('click', () => {
    settingsPanel.classList.toggle('open');
  });

  document.addEventListener('click', (e) => {
    if (!settingsPanel.contains(e.target) && !settingsBtn.contains(e.target)) {
      settingsPanel.classList.remove('open');
    }
  });

  // Dark mode setup
  if (localStorage.getItem('darkMode') === 'enabled') {
    document.body.classList.remove('light-mode');
    darkModeToggle.checked = true;
  } else {
    document.body.classList.add('light-mode');
    darkModeToggle.checked = false;
  }

  darkModeToggle.addEventListener('change', () => {
    if (darkModeToggle.checked) {
      document.body.classList.remove('light-mode');
      localStorage.setItem('darkMode', 'enabled');
    } else {
      document.body.classList.add('light-mode');
      localStorage.setItem('darkMode', 'disabled');
    }
  });

  // Nav links iframe switching
  const links = {
    'home-link': '/home',
    'members-link': '/members',
    'about-link': '/about',
    'nebula-ai-link': '/nebula-ai',
    'contact-link': '/contact'
  };

  Object.entries(links).forEach(([id, url]) => {
    const link = document.getElementById(id);
    if (!link) return;

    link.addEventListener('click', (e) => {
      e.preventDefault();

      // Update iframe src
      iframe.src = url;

      // Update active link class
      document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
      link.classList.add('active');
    });
  });
});
