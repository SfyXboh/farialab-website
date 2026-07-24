const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.site-header nav');
const searchToggle = document.querySelectorAll('.search-toggle');
const searchContainer = document.querySelector('.search-container');

if (menuToggle && nav && searchToggle && searchContainer) {
    // toggle menu on small screens with open class
    menuToggle.addEventListener('click', () => {
        nav.classList.toggle('open');
    });

    document.querySelectorAll('.site-header nav a').forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('open');
        });
    });

    // toggle menu on large screens with hide class
    searchToggle.forEach(toggle => {
        toggle.addEventListener('click', () => {
            searchContainer.classList.toggle('show');
            nav.classList.toggle('hide');
        });
    });

}

const header = document.querySelector('.site-header');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    header.classList.add('shrink');
  } else {
    header.classList.remove('shrink');
  }
});