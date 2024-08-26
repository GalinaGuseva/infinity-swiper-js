document.addEventListener('DOMContentLoaded', function () {
  const hamburger = document.querySelector('.hamburger'),
    nav_menu = document.querySelector('.nav-menu'),
    menu = document.querySelector('.navbar'),
    links = document.querySelectorAll('header nav a');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    nav_menu.classList.toggle('active');
    menu.classList.toggle('active');
  });
  document.querySelectorAll('.nav-link').forEach((n) =>
    n.addEventListener('click', () => {
      hamburger.classList.remove('active');
      nav_menu.classList.remove('active');
    })
  );

  for (const link of links) {
    link.addEventListener('click', clickHandler);
  }
  function clickHandler(e) {
    e.preventDefault();
    const href = this.getAttribute('href');
    document.querySelector(href).scrollIntoView({
      behavior: 'smooth',
    });
  }
});
