
(function() {
  'use strict';

  // Configuration
  const config = {
    // Animation classes that can be applied via data-animate attribute
    animations: {
      'fade-up': 'animate-fade-up',
      'fade-down': 'animate-fade-down',
      'fade-left': 'animate-fade-left',
      'fade-right': 'animate-fade-right',
      'fade-in': 'animate-fade-in',
      'scale-in': 'animate-scale-in',
      'slide-up': 'animate-slide-up',
      'slide-down': 'animate-slide-down',
      'rotate-in': 'animate-rotate-in',
      'blur-in': 'animate-blur-in',
      'neon-pulse': 'animate-neon-pulse',
      'float': 'animate-float',
      'glow': 'animate-glow'
    },

    // Default options
    defaults: {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
      staggerDelay: 100,
      once: true // Only animate once
    }
  };

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Utility: Add CSS to document if not already present
  function injectAnimationStyles() {
    if (document.getElementById('portfolio-animations')) return;

    const styles = document.createElement('style');
    styles.id = 'portfolio-animations';
    styles.textContent = `
      /* Base animation setup */
      [data-animate] {
        opacity: 0;
        will-change: transform, opacity;
      }

      [data-animate].visible {
        opacity: 1;
      }

      /* Fade animations */
      @keyframes fadeUp {
        from { 
          opacity: 0; 
          transform: translateY(30px); 
        }
        to { 
          opacity: 1; 
          transform: translateY(0); 
        }
      }

      @keyframes fadeDown {
        from { 
          opacity: 0; 
          transform: translateY(-30px); 
        }
        to { 
          opacity: 1; 
          transform: translateY(0); 
        }
      }

      @keyframes fadeLeft {
        from { 
          opacity: 0; 
          transform: translateX(30px); 
        }
        to { 
          opacity: 1; 
          transform: translateX(0); 
        }
      }

      @keyframes fadeRight {
        from { 
          opacity: 0; 
          transform: translateX(-30px); 
        }
        to { 
          opacity: 1; 
          transform: translateX(0); 
        }
      }

      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }

      /* Scale animations */
      @keyframes scaleIn {
        from { 
          opacity: 0; 
          transform: scale(0.9); 
        }
        to { 
          opacity: 1; 
          transform: scale(1); 
        }
      }

      @keyframes scaleInBounce {
        0% { 
          opacity: 0; 
          transform: scale(0.3); 
        }
        50% { 
          transform: scale(1.05); 
        }
        70% { 
          transform: scale(0.95); 
        }
        100% { 
          opacity: 1; 
          transform: scale(1); 
        }
      }

      /* Slide animations */
      @keyframes slideUp {
        from { 
          opacity: 0; 
          transform: translateY(100%); 
        }
        to { 
          opacity: 1; 
          transform: translateY(0); 
        }
      }

      @keyframes slideDown {
        from { 
          opacity: 0; 
          transform: translateY(-100%); 
        }
        to { 
          opacity: 1; 
          transform: translateY(0); 
        }
      }

      /* Rotate animations */
      @keyframes rotateIn {
        from { 
          opacity: 0; 
          transform: rotate(-10deg) scale(0.9); 
        }
        to { 
          opacity: 1; 
          transform: rotate(0) scale(1); 
        }
      }

      /* Blur animation */
      @keyframes blurIn {
        from { 
          opacity: 0; 
          filter: blur(10px); 
        }
        to { 
          opacity: 1; 
          filter: blur(0); 
        }
      }

      /* Neon pulse (cyber theme) */
      @keyframes neonPulse {
        0%, 100% { 
          box-shadow: 0 0 5px var(--accent, #00ffc8), 
                      0 0 20px var(--accent, #00ffc8); 
        }
        50% { 
          box-shadow: 0 0 10px var(--accent, #00ffc8), 
                      0 0 40px var(--accent, #00ffc8), 
                      0 0 60px var(--accent, #00ffc8); 
        }
      }

      /* Float animation */
      @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
      }

      /* Glow animation */
      @keyframes glow {
        0%, 100% { 
          box-shadow: 0 0 20px rgba(99,102,241,0.2); 
        }
        50% { 
          box-shadow: 0 0 40px rgba(99,102,241,0.4), 
                      0 0 60px rgba(99,102,241,0.2); 
        }
      }

      /* Shimmer for loading states */
      @keyframes shimmer {
        0% { background-position: -200% center; }
        100% { background-position: 200% center; }
      }

      /* Grid move (cyber theme) */
      @keyframes gridMove {
        from { background-position: 0 0; }
        to { background-position: 40px 40px; }
      }

      /* Pulse for status indicators */
      @keyframes pulse {
        0%, 100% { opacity: 1; transform: scale(1); }
        50% { opacity: 0.5; transform: scale(1.1); }
      }

      /* Typing cursor blink */
      @keyframes blink {
        0%, 100% { opacity: 1; }
        50% { opacity: 0; }
      }

      /* Apply animation classes */
      .animate-fade-up.visible { 
        animation: fadeUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards; 
      }
      .animate-fade-down.visible { 
        animation: fadeDown 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards; 
      }
      .animate-fade-left.visible { 
        animation: fadeLeft 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards; 
      }
      .animate-fade-right.visible { 
        animation: fadeRight 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards; 
      }
      .animate-fade-in.visible { 
        animation: fadeIn 0.5s ease-out forwards; 
      }
      .animate-scale-in.visible { 
        animation: scaleIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; 
      }
      .animate-slide-up.visible { 
        animation: slideUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards; 
      }
      .animate-slide-down.visible { 
        animation: slideDown 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards; 
      }
      .animate-rotate-in.visible { 
        animation: rotateIn 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards; 
      }
      .animate-blur-in.visible { 
        animation: blurIn 0.7s ease-out forwards; 
      }

      /* Continuous animations */
      .animate-neon-pulse {
        animation: neonPulse 2s infinite;
      }
      .animate-float {
        animation: float 3s ease-in-out infinite;
      }
      .animate-glow {
        animation: glow 2s ease-in-out infinite;
      }
      .animate-pulse {
        animation: pulse 2s infinite;
      }
      .animate-blink {
        animation: blink 1s infinite;
      }

      /* Stagger delays */
      .stagger-1 { animation-delay: 0.1s; }
      .stagger-2 { animation-delay: 0.2s; }
      .stagger-3 { animation-delay: 0.3s; }
      .stagger-4 { animation-delay: 0.4s; }
      .stagger-5 { animation-delay: 0.5s; }
      .stagger-6 { animation-delay: 0.6s; }

      /* Duration modifiers */
      .duration-fast { animation-duration: 0.3s; }
      .duration-slow { animation-duration: 0.8s; }
      .duration-slower { animation-duration: 1.2s; }

      /* Easing modifiers */
      .ease-bounce { 
        animation-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1.275); 
      }
      .ease-smooth { 
        animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1); 
      }
      .ease-out-expo { 
        animation-timing-function: cubic-bezier(0.19, 1, 0.22, 1); 
      }

      /* Hover animations */
      .hover-lift {
        transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      }
      .hover-lift:hover {
        transform: translateY(-8px);
      }

      .hover-scale {
        transition: transform 0.3s ease;
      }
      .hover-scale:hover {
        transform: scale(1.05);
      }

      .hover-rotate {
        transition: transform 0.3s ease;
      }
      .hover-rotate:hover {
        transform: rotate(5deg);
      }

      /* Theme-specific animations */
      [data-theme="cyber"] .cyber-glitch {
        position: relative;
      }

      [data-theme="cyber"] .cyber-glitch::before,
      [data-theme="cyber"] .cyber-glitch::after {
        content: attr(data-text);
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
      }

      [data-theme="cyber"] .cyber-glitch:hover::before {
        animation: glitch-1 0.3s infinite;
        color: #ff2d78;
        z-index: -1;
        opacity: 0.8;
      }

      [data-theme="cyber"] .cyber-glitch:hover::after {
        animation: glitch-2 0.3s infinite;
        color: #00ffc8;
        z-index: -2;
        opacity: 0.8;
      }

      @keyframes glitch-1 {
        0%, 100% { transform: translate(0); }
        20% { transform: translate(-2px, 2px); }
        40% { transform: translate(-2px, -2px); }
        60% { transform: translate(2px, 2px); }
        80% { transform: translate(2px, -2px); }
      }

      @keyframes glitch-2 {
        0%, 100% { transform: translate(0); }
        20% { transform: translate(2px, -2px); }
        40% { transform: translate(2px, 2px); }
        60% { transform: translate(-2px, -2px); }
        80% { transform: translate(-2px, 2px); }
      }

      /* 3D Depth theme specific */
      [data-theme="depth"] .depth-shadow {
        transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      }

      [data-theme="depth"] .depth-shadow:hover {
        transform: translateY(-6px);
        box-shadow: 
          0 2px 0 #d8dbe8,
          0 4px 0 #cdd0df,
          0 6px 0 #c2c6d6,
          0 8px 0 #b7bbcd,
          0 10px 0 #acb0c4,
          0 20px 30px rgba(0,0,0,0.15);
      }

      /* Reduced motion */
      @media (prefers-reduced-motion: reduce) {
        [data-animate] {
          opacity: 1;
          animation: none !important;
          transform: none !important;
        }

        .animate-float,
        .animate-neon-pulse,
        .animate-glow,
        .animate-pulse {
          animation: none;
        }
      }
    `;

    document.head.appendChild(styles);
  }

  // Main Animation Controller
  class AnimationController {
    constructor(options = {}) {
      this.options = { ...config.defaults, ...options };
      this.observer = null;
      this.elements = [];

      this.init();
    }

    init() {
      injectAnimationStyles();

      if (prefersReducedMotion) {
        // Make all animated elements visible immediately
        document.querySelectorAll('[data-animate]').forEach(el => {
          el.style.opacity = '1';
          el.classList.add('visible');
        });
        return;
      }

      this.setupIntersectionObserver();
      this.handleStaggerGroups();
      this.setupScrollTopButton();
      this.setupParallax();
    }

    setupIntersectionObserver() {
      const observerOptions = {
        threshold: this.options.threshold,
        rootMargin: this.options.rootMargin
      };

      this.observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.animateElement(entry.target);

            if (this.options.once) {
              this.observer.unobserve(entry.target);
            }
          }
        });
      }, observerOptions);

      // Observe all elements with data-animate
      document.querySelectorAll('[data-animate]').forEach(el => {
        this.observer.observe(el);
      });
    }

    animateElement(element) {
      const animationType = element.dataset.animate;
      const animationClass = config.animations[animationType] || 'animate-fade-up';

      // Add stagger delay if specified
      const staggerIndex = element.dataset.stagger;
      if (staggerIndex) {
        element.style.animationDelay = `${staggerIndex * this.options.staggerDelay}ms`;
      }

      // Add custom duration if specified
      if (element.dataset.duration) {
        element.style.animationDuration = element.dataset.duration;
      }

      element.classList.add(animationClass, 'visible');

      // Trigger custom event
      element.dispatchEvent(new CustomEvent('animated', { 
        detail: { animation: animationType } 
      }));
    }

    handleStaggerGroups() {
      document.querySelectorAll('[data-stagger-group]').forEach(group => {
        const children = group.querySelectorAll('[data-animate]');
        children.forEach((child, index) => {
          child.dataset.stagger = index + 1;
        });
      });
    }

    setupScrollTopButton() {
      const scrollTopBtn = document.getElementById('scrollTop');
      if (!scrollTopBtn) return;

      const toggleVisibility = () => {
        if (window.scrollY > 500) {
          scrollTopBtn.classList.add('visible');
        } else {
          scrollTopBtn.classList.remove('visible');
        }
      };

      window.addEventListener('scroll', toggleVisibility, { passive: true });

      scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    setupParallax() {
      const parallaxElements = document.querySelectorAll('[data-parallax]');
      if (parallaxElements.length === 0 || prefersReducedMotion) return;

      let ticking = false;

      const updateParallax = () => {
        const scrollY = window.scrollY;

        parallaxElements.forEach(el => {
          const speed = parseFloat(el.dataset.parallax) || 0.5;
          const yPos = scrollY * speed;
          el.style.transform = `translateY(${yPos}px)`;
        });

        ticking = false;
      };

      window.addEventListener('scroll', () => {
        if (!ticking) {
          requestAnimationFrame(updateParallax);
          ticking = true;
        }
      }, { passive: true });
    }

    // Public API methods
    refresh() {
      // Re-observe new elements
      document.querySelectorAll('[data-animate]:not(.visible)').forEach(el => {
        this.observer.observe(el);
      });
      this.handleStaggerGroups();
    }

    animate(selector, type = 'fade-up', options = {}) {
      const elements = document.querySelectorAll(selector);
      elements.forEach(el => {
        el.dataset.animate = type;
        if (options.stagger) el.dataset.stagger = options.stagger;
        if (options.duration) el.dataset.duration = options.duration;
        this.observer.observe(el);
      });
    }

    destroy() {
      if (this.observer) {
        this.observer.disconnect();
      }
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      window.portfolioAnimations = new AnimationController();
    });
  } else {
    window.portfolioAnimations = new AnimationController();
  }

  // Expose to global scope for manual control
  window.AnimationController = AnimationController;

})();