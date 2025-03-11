// Mobile Menu Functionality
const mobileMenuButton = document.querySelector('.mobile-menu-button');
const mobileMenu = document.querySelector('.mobile-menu');

if (mobileMenuButton) {
    mobileMenuButton.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });

    // Close mobile menu when clicking a link
    document.querySelectorAll('.mobile-menu a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!mobileMenu.contains(e.target) && !mobileMenuButton.contains(e.target)) {
            mobileMenu.classList.add('hidden');
        }
    });
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Add animation classes to elements when they come into view
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.animate-on-scroll');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementBottom = element.getBoundingClientRect().bottom;
        
        if (elementTop < window.innerHeight && elementBottom > 0) {
            element.classList.add('animated');
        }
    });
};

// Handle contact form submission with improved error handling
const contactForm = document.querySelector('#contactForm');
if (contactForm) {
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const submitText = submitButton.querySelector('.submit-text');
    const loadingSpinner = submitButton.querySelector('.loading-spinner');
    const successMessage = document.querySelector('#successMessage');
    const errorMessage = document.querySelector('#errorMessage');

    const setLoading = (isLoading) => {
        if (isLoading) {
            submitText.classList.add('hidden');
            loadingSpinner.classList.remove('hidden');
            submitButton.disabled = true;
        } else {
            submitText.classList.remove('hidden');
            loadingSpinner.classList.add('hidden');
            submitButton.disabled = false;
        }
    };

    const showMessage = (type, show = true) => {
        successMessage.classList.add('hidden');
        errorMessage.classList.add('hidden');
        if (show) {
            if (type === 'success') {
                successMessage.classList.remove('hidden');
            } else {
                errorMessage.classList.remove('hidden');
            }
        }
    };

    const validateForm = () => {
        let isValid = true;
        const errorMessages = contactForm.querySelectorAll('.error-message');
        errorMessages.forEach(msg => msg.classList.add('hidden'));

        // Validate name
        const name = contactForm.querySelector('#name');
        if (!name.value.trim()) {
            isValid = false;
            const error = name.nextElementSibling;
            error.textContent = 'Name is required';
            error.classList.remove('hidden');
        }

        // Validate email
        const email = contactForm.querySelector('#email');
        if (!email.value.trim()) {
            isValid = false;
            const error = email.nextElementSibling;
            error.textContent = 'Email is required';
            error.classList.remove('hidden');
        } else if (!/\S+@\S+\.\S+/.test(email.value)) {
            isValid = false;
            const error = email.nextElementSibling;
            error.textContent = 'Please enter a valid email address';
            error.classList.remove('hidden');
        }

        // Validate message
        const message = contactForm.querySelector('#message');
        if (!message.value.trim()) {
            isValid = false;
            const error = message.nextElementSibling;
            error.textContent = 'Message is required';
            error.classList.remove('hidden');
        }

        return isValid;
    };

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        showMessage('success', false);
        showMessage('error', false);

        if (!validateForm()) {
            return;
        }

        setLoading(true);
        
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);
        
        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            
            const result = await response.json();
            
            if (response.ok) {
                showMessage('success');
                contactForm.reset();
            } else {
                throw new Error(result.message || 'Failed to send message');
            }
        } catch (error) {
            console.error('Error:', error);
            showMessage('error');
        } finally {
            setLoading(false);
        }
    });

    // Clear error messages on input
    contactForm.querySelectorAll('input, textarea').forEach(input => {
        input.addEventListener('input', () => {
            const error = input.nextElementSibling;
            error.classList.add('hidden');
            showMessage('success', false);
            showMessage('error', false);
        });
    });
}

// Add skill icons animation
document.querySelectorAll('.skill-icon').forEach(icon => {
    icon.addEventListener('mouseenter', () => {
        icon.style.transform = 'translateY(-5px)';
    });
    
    icon.addEventListener('mouseleave', () => {
        icon.style.transform = 'translateY(0)';
    });
});

// Update active navigation link based on scroll position
const updateActiveNavLink = () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('nav a');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        const scrollPosition = window.scrollY;
        
        if (scrollPosition >= sectionTop - 100 && scrollPosition < sectionTop + sectionHeight - 100) {
            const targetId = section.getAttribute('id');
            navLinks.forEach(link => {
                link.classList.remove('text-blue-500');
                if (link.getAttribute('href') === `#${targetId}`) {
                    link.classList.add('text-blue-500');
                }
            });
        }
    });
};

// Event listeners
window.addEventListener('scroll', () => {
    animateOnScroll();
    updateActiveNavLink();
});

// Initialize animations on page load
document.addEventListener('DOMContentLoaded', () => {
    animateOnScroll();
    updateActiveNavLink();
}); 