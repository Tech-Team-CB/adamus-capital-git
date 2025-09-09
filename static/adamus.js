
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

//Form handling - Solo validaciones, luego envío con AJAX para mostrar mensaje personalizado
document.querySelector('.inquiry-form').addEventListener('submit', function (e) {
    e.preventDefault(); // Prevenir envío normal para manejar con AJAX

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
    
    // Si la validación falla, no continuar
    if (!valid) {
        return false;
    }
    
    // Si llegamos aquí, las validaciones pasaron
    const submitBtn = document.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.style.background = '#666';
    submitBtn.disabled = true;
    
    // Preparar datos del formulario para envío AJAX
    const formData = new FormData(this);
    
    // Enviar con fetch
    fetch('https://formsubmit.co/dakho2003@gmail.com', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        // Cambiar botón a estado de éxito
        submitBtn.textContent = 'Message Sent Successfully!';
        submitBtn.style.background = '#28a745';
        
        // Limpiar formulario
        this.reset();
        
        // Mostrar mensaje de confirmación elegante
        showSuccessMessage();
        
        // Restaurar botón después de 3 segundos
        setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.style.background = '#1a1a1a';
            submitBtn.disabled = false;
        }, 3000);
    })
    .catch(error => {
        // En caso de error
        submitBtn.textContent = 'Error - Please try again';
        submitBtn.style.background = '#dc3545';
        
        // Restaurar botón después de 3 segundos
        setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.style.background = '#1a1a1a';
            submitBtn.disabled = false;
        }, 3000);
    });
});

// Función para mostrar mensaje de éxito elegante
function showSuccessMessage() {
    // Crear overlay
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;
    
    // Crear modal
    const modal = document.createElement('div');
    modal.style.cssText = `
        background: white;
        padding: 40px;
        border-radius: 10px;
        text-align: center;
        max-width: 500px;
        margin: 20px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        transform: scale(0.7);
        transition: transform 0.3s ease;
    `;
    
    modal.innerHTML = `
        <div style="color: #28a745; font-size: 48px; margin-bottom: 20px;">✓</div>
        <h2 style="color: #333; margin-bottom: 15px; font-size: 24px;">Message Sent Successfully!</h2>
        <p style="color: #666; line-height: 1.6; margin-bottom: 25px;">
            Thank you for your inquiry. We have received your message and will review it carefully. 
            Our team will respond to qualified inquiries within 2-3 business days.
        </p>
        <button id="closeModal" style="
            background: #1a1a1a;
            color: white;
            border: none;
            padding: 12px 30px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
            transition: background 0.3s ease;
        ">Close</button>
    `;
    
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    
    // Animar entrada
    setTimeout(() => {
        overlay.style.opacity = '1';
        modal.style.transform = 'scale(1)';
    }, 10);
    
    // Función para cerrar modal
    function closeModal() {
        overlay.style.opacity = '0';
        modal.style.transform = 'scale(0.7)';
        setTimeout(() => {
            document.body.removeChild(overlay);
        }, 300);
    }
    
    // Eventos para cerrar
    document.getElementById('closeModal').addEventListener('click', closeModal);
    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) closeModal();
    });
    
    // Auto cerrar después de 5 segundos
    setTimeout(closeModal, 5000);
}

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
