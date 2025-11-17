const nav = document.querySelector('nav');
const menuButton = document.querySelector('#menu-button');
const header = document.querySelector('header');

menuButton.addEventListener('click', () => {
    header.classList.toggle('open');
    
    const isExpanded = menuButton.getAttribute('aria-expanded') === 'true' || false;
    menuButton.setAttribute('aria-expanded', !isExpanded);
});