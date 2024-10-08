function toggleMenu() {
    const navMenu = document.getElementById('nav-menu');
    const navItems = document.getElementById('nav-items');
    const menuIcon = document.querySelector('.menu-icon');

    navMenu.classList.toggle('show');
    navItems.classList.toggle('show');

    // Change hamburger to X or vice versa
    if (navMenu.classList.contains('show')) {
        menuIcon.innerHTML = '&times;'; // X mark
    } else {
        menuIcon.innerHTML = '&#9776;'; // Hamburger menu
    }
}



function navigateToSection(event) {
    event.preventDefault();
    const targetSectionId = event.target.getAttribute('data-target');
    showSection(targetSectionId);
    updateURL(targetSectionId);

    // Close the menu after navigating
    toggleMenu();
}

function showSection(sectionId) {
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.classList.remove('active');
    });

    const activeSection = document.getElementById(sectionId);
    if (activeSection) {
        activeSection.classList.add('active');
    }
}

function updateURL(sectionId) {
    history.pushState(null, null, `/${sectionId}`);
}

// On page load, display the correct section or redirect to /home
document.addEventListener('DOMContentLoaded', () => {
    let sectionId = location.pathname.replace('/', '');
    
    // If no section specified, default to 'home'
    if (!sectionId || sectionId === 'index.html') {
        sectionId = 'home';
        history.replaceState(null, null, `/home`);
    }
    
    showSection(sectionId);
});

// Handle back/forward navigation
window.addEventListener('popstate', () => {
    const sectionId = location.pathname.replace('/', '') || 'home';
    showSection(sectionId);
});
