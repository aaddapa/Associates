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

function performCalculation() {
    const number1 = parseFloat(document.getElementById('number1').value);
    const number2 = parseFloat(document.getElementById('number2').value);

    if (isNaN(number1) || isNaN(number2)) {
        alert('Please enter valid numbers!');
        return;
    }

    const result = number1 + number2; // Change to other operations if needed
    document.getElementById('calculation-result').textContent = `Result: ${result}`;
}


// Handle back/forward navigation
window.addEventListener('popstate', () => {
    const sectionId = location.pathname.replace('/', '') || 'home';
    showSection(sectionId);
});

document.addEventListener('DOMContentLoaded', () => {
    const jsonFilePath = './data.json'; // Path to your JSON file
    let jsonData = null; // Declare jsonData globally

    // Fetch JSON data
    fetch(jsonFilePath)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            jsonData = data; // Store fetched data globally
            renderMonthCards(jsonData);
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });

    // Function to render month cards
    function renderMonthCards(jsonData) {
        const keyDatesContainer = document.getElementById('key-dates');

        // Clear existing content
        keyDatesContainer.innerHTML = '';

        // Loop through JSON data and create cards for each month
        jsonData.data.forEach(monthData => {
            const card = document.createElement('div');
            card.classList.add('month-card');
            card.innerHTML = `<h3>${monthData.month}</h3>`;
            card.addEventListener('click', () => renderKeyDates(monthData)); // Add click event
            keyDatesContainer.appendChild(card);
        });
    }

    // Function to render key dates for a selected month
    function renderKeyDates(monthData) {
        const keyDatesContainer = document.getElementById('key-dates');

        // Clear existing content
        keyDatesContainer.innerHTML = '';

        // Add back button
        const backButton = document.createElement('button');
        backButton.textContent = 'Back to Months';
        backButton.classList.add('back-button');
        backButton.addEventListener('click', () => renderMonthCards(jsonData)); // Use jsonData to go back
        keyDatesContainer.appendChild(backButton);

        // Add month title
        const monthTitle = document.createElement('h2');
        monthTitle.textContent = monthData.month;
        keyDatesContainer.appendChild(monthTitle);

        // Create a table for key dates
        const table = document.createElement('table');
        table.classList.add('key-dates-table');

        // Add table headers
        const tableHeader = `
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Category</th>
                    <th>Description</th>
                </tr>
            </thead>`;
        table.innerHTML = tableHeader;

        // Add table body with key dates
        const tableBody = document.createElement('tbody');
        monthData.key_dates.forEach(dateEntry => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${dateEntry.date}</td>
                <td>${dateEntry.category}</td>
                <td>${dateEntry.description}</td>
            `;
            tableBody.appendChild(row);
        });

        table.appendChild(tableBody);
        keyDatesContainer.appendChild(table);
    }
});