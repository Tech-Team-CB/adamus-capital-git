
// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Scroll progress
window.addEventListener('scroll', () => {
    const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    document.querySelector('.scroll-progress').style.width = scrolled + '%';
});

// Header background on scroll
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(254, 254, 254, 0.95)';
        header.style.borderBottom = '1px solid rgba(26, 26, 26, 0.12)';
    } else {
        header.style.background = 'rgba(254, 254, 254, 0.9)';
        header.style.borderBottom = '1px solid rgba(26, 26, 26, 0.08)';
    }
});

// Intersection Observer
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.classList.add('visible');
            }, index * 150);
        }
    });
}, observerOptions);

// Observe elements
document.querySelectorAll('.section-header, .approach-item, .value-item, .location, .contact-container').forEach(el => {
    observer.observe(el);
});

//Form handling
document.querySelector('.inquiry-form').addEventListener('submit', function (e) {

    // Elimina mensajes de error previos
    document.querySelectorAll('.input-error-message').forEach(el => el.remove());

    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    let valid = true;

    // Helper para mostrar mensaje de error encima del input
    function showError(input, message) {
        const error = document.createElement('div');
        error.className = 'input-error-message';
        error.innerHTML = `<span style="color:#d60000;font-weight:700;">*${message}*</span>`;
        error.style.fontSize = '13px';
        error.style.marginBottom = '4px';
        error.style.fontWeight = '500';
        error.style.position = 'relative';
        input.parentNode.insertBefore(error, input);

        // Elimina el mensaje cuando el usuario escribe
        function removeErrorOnInput() {
            if (error.parentNode) error.parentNode.removeChild(error);
            input.removeEventListener('input', removeErrorOnInput);
        }
        input.addEventListener('input', removeErrorOnInput);
    }

    if (isMobile) {
        const fullNameInput = document.getElementById('fullName');
        if (fullNameInput) {
            if (!fullNameInput.value.trim()) {
                showError(fullNameInput, 'Please fill out this field');
                fullNameInput.focus();
                valid = false;
            } else if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ ]{2,}$/.test(fullNameInput.value.trim())) {
                showError(fullNameInput, 'Only letters allowed');
                fullNameInput.focus();
                valid = false;
            }
        }
    } else {
        const firstName = document.getElementById('firstName');
        const lastName = document.getElementById('lastName');
        if (firstName) {
            if (!firstName.value.trim()) {
                showError(firstName, 'Please fill out this field');
                firstName.focus();
                valid = false;
            } else if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ ]{2,}$/.test(firstName.value.trim())) {
                showError(firstName, 'Only letters allowed');
                firstName.focus();
                valid = false;
            }
        }
        if (lastName) {
            if (!lastName.value.trim()) {
                showError(lastName, 'Please fill out this field');
                lastName.focus();
                valid = false;
            } else if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ ]{2,}$/.test(lastName.value.trim())) {
                showError(lastName, 'Only letters allowed');
                lastName.focus();
                valid = false;
            }
        }
    }

    const email = document.getElementById('email');
    if (email) {
        if (!email.value.trim()) {
            showError(email, 'Please fill out this field');
            email.focus();
            valid = false;
        } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email.value.trim())) {
            showError(email, 'Invalid email format');
            email.focus();
            valid = false;
        }
    }

    const organization = document.getElementById('organization');
    if (organization) {
        if (!organization.value.trim()) {
            showError(organization, 'Please fill out this field');
            organization.focus();
            valid = false;
        } else if (!/^[A-Za-z0-9\s.,-]{2,}$/.test(organization.value.trim())) {
            showError(organization, 'Only letters, numbers, spaces, and basic punctuation allowed');
            organization.focus();
            valid = false;
        }
    }

    const inquiryType = document.getElementById('inquiryType');
    if (inquiryType) {
        if (!inquiryType.value || inquiryType.value === "") {
            showError(inquiryType, 'Please fill out this field');
            inquiryType.focus();
            valid = false;
        }
    }
    

    if (!valid) {
        e.preventDefault();
        return false;
    }
    const submitBtn = document.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;

    // Simulate form submission
    submitBtn.textContent = 'Submitting...';
    submitBtn.style.background = '#666';
    submitBtn.disabled = true;

    setTimeout(() => {
        submitBtn.textContent = 'Inquiry Received';
        submitBtn.style.background = '#4a4a4a';

        setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.style.background = '#1a1a1a';
            submitBtn.disabled = false;

            // Reset form
            this.reset();

            // Show subtle confirmation
            const form = document.querySelector('.inquiry-form');
            const confirmation = document.createElement('div');
            confirmation.innerHTML = '<p style="text-align: center; color: #666; font-size: 14px; margin-top: 20px; font-weight: 300;">Thank you. Your inquiry has been received and will be reviewed.</p>';
            form.appendChild(confirmation);

            setTimeout(() => {
                confirmation.remove();
            }, 4000);
        }, 2000);
    }, 1500);
});

// Staggered animation for approach items
const approachItems = document.querySelectorAll('.approach-item');
approachItems.forEach((item, index) => {
    item.style.transitionDelay = `${index * 0}s`;
});

// Staggered animation for value items
const valueItems = document.querySelectorAll('.value-item');
valueItems.forEach((item, index) => {
    item.style.transitionDelay = `${index * 0.1}s`;
});

// Staggered animation for locations
const locations = document.querySelectorAll('.location');
locations.forEach((item, index) => {
    item.style.transitionDelay = `${index * 0.2}s`;
});

document.addEventListener("DOMContentLoaded", () => {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('open');

        // Cambia el ícono ☰ por ✕ y viceversa
        if (hamburger.textContent.trim() === '☰') {
            hamburger.textContent = '✕';
        } else {
            hamburger.textContent = '☰';
        }
    });

    // Cierra el menú al hacer clic en un enlace
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('open');
            hamburger.textContent = '☰'; // vuelve a mostrar ☰
        });
    });
});
