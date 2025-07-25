// Modern Landing Page JavaScript
document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const mobileMenu = document.getElementById('mobile-menu');
    const navMenu = document.getElementById('nav-menu');
    
    if (mobileMenu && navMenu) {
        mobileMenu.addEventListener('click', () => {
            const isExpanded = mobileMenu.getAttribute('aria-expanded') === 'true';
            mobileMenu.setAttribute('aria-expanded', !isExpanded);
            mobileMenu.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            // Toggle body scroll when menu is open
            document.body.style.overflow = isExpanded ? 'auto' : 'hidden';
        });
        
        // Close mobile menu when clicking on a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.setAttribute('aria-expanded', 'false');
                mobileMenu.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = 'auto';
            });
        });
    }

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        let lastScrollPosition = 0;
        
        window.addEventListener('scroll', () => {
            const currentScrollPosition = window.scrollY;
            
            if (currentScrollPosition > 100) {
                navbar.style.background = 'rgba(255, 255, 255, 0.98)';
                navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
                
                if (currentScrollPosition > lastScrollPosition && currentScrollPosition > 200) {
                    navbar.style.transform = 'translateY(-100%)';
                } else {
                    navbar.style.transform = 'translateY(0)';
                }
            } else {
                navbar.style.background = 'rgba(255, 255, 255, 0.95)';
                navbar.style.boxShadow = 'none';
                navbar.style.transform = 'translateY(0)';
            }
            
            lastScrollPosition = currentScrollPosition;
        }, { passive: true });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            
            if (target) {
                const navbarHeight = navbar ? navbar.offsetHeight : 0;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update URL without page jump
                if (history.pushState) {
                    history.pushState(null, null, targetId);
                } else {
                    window.location.hash = targetId;
                }
            }
        });
    });

    // Animate elements on scroll
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.service-card, .about-text, .contact-form, .stats, .portfolio-item, .testimonial-card, .pricing-card');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

        elements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    };
    
    animateOnScroll();

    // Form submission
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            // Simple validation
            let isValid = true;
            contactForm.querySelectorAll('[required]').forEach(input => {
                if (!input.value.trim()) {
                    input.style.borderColor = '#ff6b6b';
                    isValid = false;
                } else {
                    input.style.borderColor = '';
                }
            });
            
            if (!isValid) {
                return;
            }
            
            // Disable button and show loading state
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="spinner"></span> Sending...';
            
            try {
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 2000));
                
                // Show success message
                const successMessage = document.createElement('div');
                successMessage.className = 'form-message success';
                successMessage.textContent = 'Thank you! Your message has been sent.';
                contactForm.appendChild(successMessage);
                contactForm.reset();
                
                // Remove message after 5 seconds
                setTimeout(() => {
                    successMessage.remove();
                }, 5000);
            } catch (error) {
                const errorMessage = document.createElement('div');
                errorMessage.className = 'form-message error';
                errorMessage.textContent = 'Something went wrong. Please try again.';
                contactForm.appendChild(errorMessage);
                
                setTimeout(() => {
                    errorMessage.remove();
                }, 5000);
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
            }
        });
    }

    // FAQ accordion
    const faqItems = document.querySelectorAll('.faq-item');
    if (faqItems.length) {
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            
            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                
                // Close all items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                        otherItem.querySelector('.faq-answer').style.maxHeight = '0';
                        otherItem.querySelector('.faq-question i').className = 'fas fa-chevron-down';
                    }
                });
                
                // Toggle current item
                if (isActive) {
                    item.classList.remove('active');
                    item.querySelector('.faq-answer').style.maxHeight = '0';
                    question.querySelector('i').className = 'fas fa-chevron-down';
                } else {
                    item.classList.add('active');
                    item.querySelector('.faq-answer').style.maxHeight = `${item.querySelector('.faq-answer').scrollHeight}px`;
                    question.querySelector('i').className = 'fas fa-chevron-up';
                }
            });
        });
    }

    // Pricing toggle
    const pricingToggle = document.getElementById('pricing-toggle');
    if (pricingToggle) {
        pricingToggle.addEventListener('change', () => {
            const monthlyPrices = document.querySelectorAll('.price .amount');
            monthlyPrices.forEach(priceElement => {
                let price = parseFloat(priceElement.textContent.replace('$', ''));
                price = pricingToggle.checked ? price * 12 * 0.8 : price / 12 / 0.8;
                priceElement.textContent = `$${Math.round(price)}`;
            });
        });
    }

    // Back to top button
    const backToTop = document.getElementById('back-to-top');
    if (backToTop) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        });
    }

    // Update copyright year
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    // Portfolio filtering
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    if (filterButtons.length && portfolioItems.length) {
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Update active state
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                // Filter items
                const filterValue = button.textContent.trim();
                
                portfolioItems.forEach(item => {
                    if (filterValue === 'All' || item.dataset.category.includes(filterValue)) {
                        item.style.display = 'block';
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'translateY(0)';
                        }, 50);
                    } else {
                        item.style.opacity = '0';
                        item.style.transform = 'translateY(20px)';
                        setTimeout(() => {
                            item.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    }

    // Testimonial slider
    const testimonialSlider = document.querySelector('.testimonials-slider');
    if (testimonialSlider) {
        let currentIndex = 0;
        const testimonials = testimonialSlider.querySelectorAll('.testimonial-card');
        const testimonialCount = testimonials.length;
        
        const showTestimonial = (index) => {
            testimonials.forEach((testimonial, i) => {
                testimonial.style.opacity = i === index ? '1' : '0';
                testimonial.style.transform = i === index ? 'translateY(0)' : 'translateY(20px)';
            });
        };
        
        // Auto-rotate testimonials
        setInterval(() => {
            currentIndex = (currentIndex + 1) % testimonialCount;
            showTestimonial(currentIndex);
        }, 5000);
        
        showTestimonial(0);
    }

    // Newsletter form
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const emailInput = newsletterForm.querySelector('input[type="email"]');
            const submitBtn = newsletterForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            if (!emailInput.value || !emailInput.value.includes('@')) {
                emailInput.style.borderColor = '#ff6b6b';
                return;
            }
            
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="spinner"></span> Subscribing...';
            
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Show success message
            const successMessage = document.createElement('div');
            successMessage.className = 'newsletter-message success';
            successMessage.textContent = 'Thanks for subscribing!';
            newsletterForm.appendChild(successMessage);
            
            // Reset form
            emailInput.value = '';
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
            
            setTimeout(() => {
                successMessage.remove();
            }, 3000);
        });
    }

    // Loading animation
    window.addEventListener('load', () => {
        const loadingBar = document.createElement('div');
        loadingBar.className = 'loading-bar';
        document.body.prepend(loadingBar);
        
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 10;
            loadingBar.style.width = `${Math.min(progress, 100)}%`;
            
            if (progress >= 100) {
                clearInterval(interval);
                loadingBar.style.opacity = '0';
                setTimeout(() => loadingBar.remove(), 500);
            }
        }, 100);
    });
});

// Service Worker Registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(registration => {
            console.log('ServiceWorker registration successful');
        }).catch(err => {
            console.log('ServiceWorker registration failed: ', err);
        });
    });
}
// AI Chat Functionality
const initAIChat = () => {
  const chatContainer = document.getElementById('ai-chat-container');
  const chatToggle = document.getElementById('ai-chat-toggle');
  const chatClose = document.getElementById('ai-chat-close');
  const chatMessages = document.getElementById('ai-chat-messages');
  const chatInput = document.getElementById('ai-chat-input');
  const chatSend = document.getElementById('ai-chat-send');
  
  let isChatOpen = false;
  
  // Toggle chat visibility
  const toggleChat = () => {
    isChatOpen = !isChatOpen;
    chatContainer.classList.toggle('open', isChatOpen);
  };
  
  // Add message to chat
  const addMessage = (text, isUser = false) => {
    const messageDiv = document.createElement('div');
    messageDiv.className = `ai-message ${isUser ? 'ai-user-message' : 'ai-assistant-message'}`;
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'ai-message-content';
    contentDiv.textContent = text;
    
    messageDiv.appendChild(contentDiv);
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  };
  
  // Show typing indicator
  const showTyping = () => {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'ai-message ai-assistant-message typing-indicator';
    
    typingDiv.innerHTML = `
      <span></span>
      <span></span>
      <span></span>
    `;
    
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return typingDiv;
  };
  
  // Hide typing indicator
  const hideTyping = (typingElement) => {
    if (typingElement && typingElement.parentNode) {
      typingElement.remove();
    }
  };
  
  // Process user input
  const processInput = () => {
    const message = chatInput.value.trim();
    if (!message) return;
    
    // Add user message
    addMessage(message, true);
    chatInput.value = '';
    
    // Show typing indicator
    const typingElement = showTyping();
    
    // Simulate AI response (in a real app, you would call an API here)
    setTimeout(() => {
      hideTyping(typingElement);
      
      // Simple response logic - replace with actual AI API call
      const responses = [
        "I understand your question about " + message + ". Let me help with that.",
        "That's an interesting point about " + message + ". Here's what I can tell you...",
        "Thanks for asking about " + message + ". Here's some information that might help.",
        "I've processed your request regarding " + message + ". Here's my response.",
        message + " is an important topic. Here are some details you might find useful."
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      addMessage(randomResponse);
    }, 1500);
  };
  
  // Event listeners
  chatToggle.addEventListener('click', toggleChat);
  chatClose.addEventListener('click', toggleChat);
  
  chatSend.addEventListener('click', processInput);
  
  chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      processInput();
    }
  });
  
  // In a real implementation, you would connect to an AI API here
  // For example:
  /*
  const getAIResponse = async (message) => {
    try {
      const response = await fetch('https://api.your-ai-service.com/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer YOUR_API_KEY'
        },
        body: JSON.stringify({ message })
      });
      
      const data = await response.json();
      return data.reply;
    } catch (error) {
      console.error('Error getting AI response:', error);
      return "Sorry, I'm having trouble connecting to the AI service.";
    }
  };
  */
};

// Initialize AI Chat when DOM is loaded
document.addEventListener('DOMContentLoaded', initAIChat);