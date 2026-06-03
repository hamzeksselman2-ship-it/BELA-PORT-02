document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    /* ==========================================================================
       THEME SWITCHER (DARK & LIGHT MODE)
       ========================================================================== */
    const themeToggle = document.getElementById('theme-toggle');
    
    // Check local storage for preference, default to dark
    const currentTheme = localStorage.getItem('theme') || 'dark';
    
    if (currentTheme === 'light') {
        document.body.classList.add('light-theme');
    }

    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
        
        let theme = 'dark';
        if (document.body.classList.contains('light-theme')) {
            theme = 'light';
        }
        
        localStorage.setItem('theme', theme);
    });

    /* ==========================================================================
       MOBILE NAVIGATION DRAWER
       ========================================================================== */
    const mobileToggle = document.getElementById('mobile-nav-toggle');
    const navLinksContainer = document.getElementById('nav-links');
    const menuIcon = mobileToggle.querySelector('.icon-menu');
    const closeIcon = mobileToggle.querySelector('.icon-close');
    const navLinksList = document.querySelectorAll('.nav-link');

    function toggleMenu() {
        navLinksContainer.classList.toggle('nav-active');
        document.body.classList.toggle('mobile-nav-active');
        
        if (navLinksContainer.classList.contains('nav-active')) {
            menuIcon.style.display = 'none';
            closeIcon.style.display = 'block';
        } else {
            menuIcon.style.display = 'block';
            closeIcon.style.display = 'none';
        }
    }

    mobileToggle.addEventListener('click', toggleMenu);

    // Close menu when a link is clicked
    navLinksList.forEach(link => {
        link.addEventListener('click', () => {
            if (navLinksContainer.classList.contains('nav-active')) {
                toggleMenu();
            }
        });
    });

    /* ==========================================================================
       SCROLL EFFECTS & STICKY NAVBAR
       ========================================================================== */
    const navbar = document.getElementById('navbar');
    const sections = document.querySelectorAll('section');
    
    window.addEventListener('scroll', () => {
        // Sticky Header scroll styling
        if (window.scrollY > 50) {
            navbar.classList.add('nav-scrolled');
        } else {
            navbar.classList.remove('nav-scrolled');
        }

        // Active link on scroll highlight
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        if (currentSectionId) {
            navLinksList.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${currentSectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });

    /* ==========================================================================
       PORTFOLIO FILTER SHOWCASE
       ========================================================================== */
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            // Remove active from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active to current
            button.classList.add('active');
            
            const filterValue = button.getAttribute('data-filter');
            
            portfolioItems.forEach(item => {
                // Apply a simple smooth transition scaling
                item.style.transform = 'scale(0.8)';
                item.style.opacity = '0';
                
                setTimeout(() => {
                    if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                        item.style.display = 'block';
                        setTimeout(() => {
                            item.style.transform = 'scale(1)';
                            item.style.opacity = '1';
                        }, 50);
                    } else {
                        item.style.display = 'none';
                    }
                }, 300);
            });
        });
    });

    /* ==========================================================================
       VIDEO PLAYER MODAL
       ========================================================================== */
    const videoModal = document.getElementById('video-modal');
    const modalBackdrop = videoModal.querySelector('.modal-backdrop');
    const modalClose = document.getElementById('modal-close');
    const modalTitle = document.getElementById('modal-title');
    const modalVideo = document.getElementById('modal-video-element');
    
    // Play buttons trigger list
    const playButtons = document.querySelectorAll('#play-showreel-btn, .project-play-btn');

    function openModal(videoUrl, titleText) {
        modalTitle.textContent = titleText;
        modalVideo.src = videoUrl;
        videoModal.classList.add('modal-active');
        document.body.style.overflow = 'hidden'; // Lock background scroll
        modalVideo.load();
        modalVideo.play().catch(error => {
            console.log('Video autoplay interrupted or unsupported:', error);
        });
    }

    function closeModal() {
        videoModal.classList.remove('modal-active');
        document.body.style.overflow = ''; // Unlock background scroll
        modalVideo.pause();
        modalVideo.src = ''; // Clear source to stop load/network buffer
    }

    playButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const videoUrl = btn.getAttribute('data-video');
            const titleText = btn.getAttribute('data-title') || 'Project Video';
            if (videoUrl) {
                openModal(videoUrl, titleText);
            }
        });
    });

    modalClose.addEventListener('click', closeModal);
    modalBackdrop.addEventListener('click', closeModal);
    
    // Escape key modal close
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && videoModal.classList.contains('modal-active')) {
            closeModal();
        }
    });

    /* ==========================================================================
       TESTIMONIALS CAROUSEL SLIDER
       ========================================================================== */
    const slides = document.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('.dot');
    let currentSlideIdx = 0;
    let slideTimer;

    function showSlide(idx) {
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        slides[idx].classList.add('active');
        dots[idx].classList.add('active');
        currentSlideIdx = idx;
    }

    function nextSlide() {
        let nextIdx = (currentSlideIdx + 1) % slides.length;
        showSlide(nextIdx);
    }

    function startSlideTimer() {
        clearInterval(slideTimer);
        slideTimer = setInterval(nextSlide, 6000); // Shift every 6 seconds
    }

    dots.forEach((dot, idx) => {
        dot.addEventListener('click', () => {
            showSlide(idx);
            startSlideTimer(); // Reset auto-rotate timer on manual click
        });
    });

    // Initialize slide timer
    startSlideTimer();

    /* ==========================================================================
       SCROLL-TRIGGER REVEALS & SKILL FILLING
       ========================================================================== */
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    const skillBars = document.querySelectorAll('.skill-bar-fill');
    const aboutSection = document.getElementById('about');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    // Generic reveal observer
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target); // Unwatch once revealed
            }
        });
    }, observerOptions);

    revealElements.forEach(el => revealObserver.observe(el));

    // Specific observer for skills bar filling animation
    if (aboutSection) {
        const skillObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Populate each skill progress bar
                    skillBars.forEach(bar => {
                        // Extract styling width from container or dataset, set to empty initially
                        const fillWidth = bar.style.width;
                        bar.style.width = '0';
                        setTimeout(() => {
                            bar.style.width = fillWidth;
                        }, 100);
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });

        skillObserver.observe(aboutSection);
    }

    /* ==========================================================================
       CONTACT FORM SUBMIT (MOCK VALIDATION)
       ========================================================================== */
    const contactForm = document.getElementById('contact-form');
    const successAlert = document.getElementById('form-success-alert');

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Custom simple check
        const nameField = document.getElementById('name').value.trim();
        const emailField = document.getElementById('email').value.trim();
        const messageField = document.getElementById('message').value.trim();

        if (nameField && emailField && messageField) {
            // Trigger animation display of alert box
            successAlert.style.display = 'flex';
            successAlert.style.opacity = '0';
            
            setTimeout(() => {
                successAlert.style.transition = 'opacity 0.4s ease';
                successAlert.style.opacity = '1';
            }, 50);

            // Clear input fields
            contactForm.reset();

            // Auto-hide alert after 8 seconds
            setTimeout(() => {
                successAlert.style.opacity = '0';
                setTimeout(() => {
                    successAlert.style.display = 'none';
                }, 400);
            }, 8000);
        }
    });
});
