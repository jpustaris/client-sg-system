async function updateApplyLink() {
    try {
        const response = await fetch('../session/set_session.php', { method: 'POST' });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        const applyLink = document.getElementById('apply-link');
        const signupLink = document.getElementById('signup-link');
        const loginLink = document.getElementById('login-link');
        const sessionDropdown = document.getElementById('session-dropdown');

        if (data.success) {
            const username = data.username;
            const isAdmin = data.isAdmin;

            applyLink.innerHTML = `<span>${username}</span>`;
            applyLink.href = isAdmin ? '../redirect/adminloading.php' : '../redirect/applicantloading.php';
            loginLink.style.display = 'none';
            signupLink.style.display = 'none';

            if (sessionDropdown) {
                sessionDropdown.disabled = false;
            }
        } else {
            applyLink.innerHTML = '<span>Apply Here</span>';
            applyLink.href = '../redirect/applicantloading.php';
            loginLink.style.display = 'inline-block';
            signupLink.style.display = 'inline-block';

            if (sessionDropdown) {
                sessionDropdown.disabled = true;
            }
        }
    } catch (error) {
        console.error('Error fetching session data:', error);
    }
}

document.addEventListener('DOMContentLoaded', updateApplyLink);

// Handle click/touch events for dropdown toggle and prevent interference from mobile menu toggle
function handleDropdownToggle(e) {
    const dropdown = e.target.closest('.dropdown');
    const sessionDropdown = document.getElementById('session-dropdown');

    const sessionActive = document.getElementById('apply-link') && document.getElementById('apply-link').innerText !== 'Apply Here';

    // Check if click is on the applyLink (which contains the username)
    const isApplyLinkClick = e.target.closest('#apply-link');

    if (sessionActive && isApplyLinkClick) {
        // If the session is active and the user clicked on the applyLink (with username), redirect
        const applyLink = document.getElementById('apply-link');
        if (applyLink && applyLink.href) {
            window.location.href = applyLink.href;  // Redirect user to the appropriate page
        }
        return;  // Prevent the dropdown from toggling
    } else {
        // Only toggle dropdown if it's a valid dropdown and session is enabled
        if (dropdown && dropdown.classList.contains('dropdown') && sessionDropdown && !sessionDropdown.disabled) {
            dropdown.classList.toggle('active');
        } else {
            // Close all active dropdowns when clicking or touching outside
            const activeDropdowns = document.querySelectorAll('.dropdown.active');
            activeDropdowns.forEach(dropdown => {
                dropdown.classList.remove('active');
            });
        }
    }
}

document.addEventListener('click', handleDropdownToggle, true); // Add capture phase to prevent event interference
document.addEventListener('touchstart', handleDropdownToggle, true); // Same for touchstart event

// Handle mobile navigation toggle (ensure it doesn't interfere with the applyLink click)
const navbar = document.querySelector('#navbar');
const mobileNavToggle = document.querySelector('.mobile-nav-toggle');

// Handle mobile navigation toggle (ensure it doesn't interfere with the applyLink click)
if (navbar) {
    navbar.addEventListener('click', function (e) {
        const target = e.target;
        
        // Check if it's a valid dropdown anchor
        const dropdownAnchor = target.closest('.navbar .dropdown > a');
        
        if (dropdownAnchor && navbar.classList.contains('navbar-mobile')) {
            e.preventDefault();  // Prevent default link behavior
            const dropdownMenu = dropdownAnchor.nextElementSibling;
            
            // Check if dropdownMenu exists before toggling class
            if (dropdownMenu) {
                dropdownMenu.classList.toggle('dropdown-active');
            }
        }

        // Handle mobile menu toggle icon click to expand/collapse the menu
        const mobileNavToggle = target.closest('.mobile-nav-toggle');
        if (mobileNavToggle) {
            // Toggle the navbar and the mobile menu icon
            const icon = mobileNavToggle.querySelector('i');
            mobileNavToggle.classList.toggle('bi-list');
            mobileNavToggle.classList.toggle('bi-x');
        }
    });
}

// Ensure that clicking "Apply Here" properly redirects on mobile
document.getElementById('apply-link')?.addEventListener('click', (e) => {
    e.stopPropagation();  // Prevent click event from triggering dropdown toggle
});

// Optional: Handle touch/click on mobile to ensure navigation behavior isn't blocked
document.getElementById('apply-link')?.addEventListener('touchstart', (e) => {
    e.stopPropagation();  // Prevent any unwanted interference from touch events
});
