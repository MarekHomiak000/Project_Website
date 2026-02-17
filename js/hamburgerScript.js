const hamburger = document.querySelector('.hamburger');
const menu = document.querySelector('.header_menu ul');
const menuLinks = document.querySelectorAll('.header_menu ul li a');

function toggleMenu() {
    menu.classList.toggle('show');
    hamburger.classList.toggle('active');
    document.body.classList.toggle('no-scroll'); // disable/enable scrolling
}

// Toggle menu when hamburger is clicked
hamburger.addEventListener('click', toggleMenu);

// Close menu when a link is clicked
menuLinks.forEach(link => {
    link.addEventListener('click', () => {
        menu.classList.remove('show');
        hamburger.classList.remove('active');
        document.body.classList.remove('no-scroll'); // enable scrolling
    });
});