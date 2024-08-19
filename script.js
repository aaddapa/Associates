function toggleMenu() {
    const navItems = document.getElementById('nav-items');
    navItems.classList.toggle('show');
}

function navigateToSection(event) {
    event.preventDefault();
    const targetSectionId = event.target.getAttribute('data-target');
    showSection(targetSectionId);
    updateURL(targetSectionId);
}

function showSection(sectionId) {
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.classList.remove('active');
    });

    const activeSection = document.getElementById(sectionId);
    activeSection.classList.add('active');
}

function updateURL(sectionId) {
    history.pushState(null, null, `/${sectionId}`);
}

// On page load, display the correct section based on the URL
document.addEventListener('DOMContentLoaded', () => {
    const sectionId = location.pathname.replace('/', '') || 'home';
    showSection(sectionId);
});
