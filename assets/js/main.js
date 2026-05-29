document.addEventListener('DOMContentLoaded', () => {
  // Particles disabled per design preference
  // initParticles();

  // Initialize 3D hover parallax effect for the central logo box
  initLogoTilt();

  // Handle arch profile photo — show placeholder if image is missing
  initProfilePhoto();

  // Start live clock in the nav bar
  initLiveClock();

  // Horizontal scroll-jacked gallery
  initWorksGallery();

  // Handle contact form submission
  initContactForm();

  // Scroll-driven reveal animations
  initScrollReveal();

  // Auto-reveal hero after entrance overlay finishes
  initHeroReveal();

  // Burger Menu toggle
  initBurgerMenu();

  // Console greeting for developers
  console.log('%c✨ Raycel Baybayon Portfolio Loaded ✨', 'color: #ffdf6d; font-size: 16px; font-weight: bold; text-shadow: 0 0 10px rgba(255,223,109,0.5)');
});

/**
 * Profile Photo — handles all arch frames on the page
 * Reuses the same CSS class, so zero extra CSS needed for page 4
 */
function initProfilePhoto() {
  // Select all image frames
  document.querySelectorAll('.arch-frame, .circular-frame, .rounded-square-frame').forEach(frame => {
    const img = frame.querySelector('img');
    const placeholder = frame.querySelector('.arch-placeholder, .circular-placeholder');
    if (!img || !placeholder) return;

    const hidePlaceholder = () => {
      placeholder.style.display = 'none';
      img.style.display = 'block';
    };

    const showPlaceholder = () => {
      img.style.display = 'none';
      placeholder.style.display = 'flex';
    };

    // If already cached/loaded before JS runs
    if (img.complete) {
      if (img.naturalHeight > 0) {
        hidePlaceholder();
      } else {
        showPlaceholder();
      }
    }

    // Image loaded successfully
    img.addEventListener('load', hidePlaceholder);

    // Image failed to load (file not found)
    img.addEventListener('error', showPlaceholder);
  });
}

/**
 * Interactive Particle Canvas System
 */
function initParticles() {
  const canvas = document.createElement('canvas');
  canvas.id = 'particle-canvas';
  canvas.style.position = 'absolute';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.zIndex = '1';
  canvas.style.pointerEvents = 'none';
  
  // Insert canvas inside the hero wrapper to render behind text elements
  const heroWrapper = document.querySelector('.hero-wrapper');
  if (heroWrapper) {
    heroWrapper.prepend(canvas);
  } else {
    document.body.prepend(canvas);
  }

  const ctx = canvas.getContext('2d');
  let animationFrameId;

  // Particle list and configuration
  let particles = [];
  const particleCount = 65; // Balanced for high performance and visual impact
  const mouse = { x: null, y: null, radius: 150 };

  // Adjust canvas size to window size
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  // Track mouse position
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  // Particle Class definition
  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2.5 + 0.5; // Fine elegant particles
      this.speedX = Math.random() * 0.4 - 0.2;
      this.speedY = Math.random() * 0.4 - 0.2;
      
      // Palette: Gold, light lavender, bright violet, white
      const colors = ['#ffdf6d', '#ebdfff', '#943bff', '#ffffff'];
      this.color = colors[Math.floor(Math.random() * colors.length)];
      this.opacity = Math.random() * 0.5 + 0.2;
      this.baseOpacity = this.opacity;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      // Wrap around edges
      if (this.x < 0) this.x = canvas.width;
      if (this.x > canvas.width) this.x = 0;
      if (this.y < 0) this.y = canvas.height;
      if (this.y > canvas.height) this.y = 0;

      // Mouse interactive behavior (repulsion/attraction)
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouse.radius) {
          const force = (mouse.radius - distance) / mouse.radius;
          const forceDirectionX = dx / distance;
          const forceDirectionY = dy / distance;
          
          // Repel gently
          this.x -= forceDirectionX * force * 1.5;
          this.y -= forceDirectionY * force * 1.5;
          
          // Glow intensity increases near cursor
          this.opacity = Math.min(1, this.baseOpacity + force * 0.4);
        } else {
          if (this.opacity > this.baseOpacity) {
            this.opacity -= 0.01;
          }
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.opacity;
      
      // Subtle glow for gold particles
      if (this.color === '#ffdf6d') {
        ctx.shadowBlur = 5;
        ctx.shadowColor = '#ffdf6d';
      } else {
        ctx.shadowBlur = 0;
      }
      
      ctx.fill();
    }
  }

  // Generate particles
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  // Animation Loop
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Clear shadow effects for non-glow objects
    ctx.shadowBlur = 0;
    
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }
    
    // Connect close particles with ultra-faint lines for premium constellation effect
    connectParticles();
    
    animationFrameId = requestAnimationFrame(animate);
  }

  // Connect close particles with thin web lines
  function connectParticles() {
    const maxDistance = 110;
    for (let a = 0; a < particles.length; a++) {
      for (let b = a; b < particles.length; b++) {
        const dx = particles[a].x - particles[b].x;
        const dy = particles[a].y - particles[b].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < maxDistance) {
          const alpha = (1 - (distance / maxDistance)) * 0.08;
          ctx.strokeStyle = `rgba(235, 223, 255, ${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(particles[b].x, particles[b].y);
          ctx.stroke();
        }
      }
    }
  }

  // Start particles animation
  animate();
}

/**
 * 3D Hover Tilt Effect for the central logo box
 */
function initLogoTilt() {
  const container = document.querySelector('.logo-box-container');
  const content = document.querySelector('.logo-box-content');
  const border = document.querySelector('.logo-box-border');

  if (!container || !content) return;

  container.addEventListener('mousemove', (e) => {
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left; // x position within the element
    const y = e.clientY - rect.top;  // y position within the element
    
    // Calculate rotation angles based on cursor position relative to center of the box
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Rotate max 15 degrees
    const rotateX = ((centerY - y) / centerY) * 15;
    const rotateY = ((x - centerX) / centerX) * 15;

    // Apply rotation
    content.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    
    // Shadow shifting to create 3D illusion
    const shadowX = -rotateY * 0.8;
    const shadowY = rotateX * 0.8;
    content.style.filter = `drop-shadow(${shadowX}px ${shadowY}px 25px rgba(148, 59, 255, 0.45))`;
    
    // Slight shift of border in opposite direction
    if (border) {
      border.style.transform = `translate3d(${-rotateY * 0.2}px, ${rotateX * 0.2}px, 10px)`;
    }
  });

  // Reset values when mouse leaves
  container.addEventListener('mouseleave', () => {
    content.style.transform = 'rotateX(0deg) rotateY(0deg)';
    content.style.filter = 'drop-shadow(0 4px 15px rgba(255, 255, 255, 0.2))';
    if (border) {
      border.style.transform = 'translate3d(0, 0, 0) scale(1)';
    }
  });
}

/**
 * Live Clock — updates the nav bar tube clock every second
 */
function initLiveClock() {
  const clock = document.getElementById('nav-live-clock');
  if (!clock) return;

  function tick() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    const display = `${String(hours).padStart(2, '0')}:${minutes}:${seconds} ${ampm}`;
    clock.textContent = display;
  }

  tick(); // show immediately
  setInterval(tick, 1000);
}

/**
 * My Works — Horizontal Scroll Gallery
 * Uses browser's native scroll bar and sticky positioning.
 */
function initWorksGallery() {
  const section = document.getElementById('page-11');
  const track = document.getElementById('worksTrack');
  const progress = document.getElementById('worksProgress');
  
  if (!section || !track) return;

  function updateGallery() {
    const inner = section.querySelector('.works-inner');
    if (!inner) return;

    const outerRect = section.getBoundingClientRect();
    const innerRect = inner.getBoundingClientRect();
    
    // When sticky is active, innerRect.top stays fixed while outerRect.top goes negative.
    // The difference between them is exactly how many pixels we've scrolled into the section!
    const scrolled = innerRect.top - outerRect.top;
    
    // Total scrollable distance is the outer height minus the sticky inner height
    const scrollRange = section.offsetHeight - innerRect.height;
    
    // Calculate progress ratio (0 to 1)
    let ratio = scrollRange > 0 ? scrolled / scrollRange : 0;
    if (ratio < 0) ratio = 0;
    if (ratio > 1) ratio = 1;
    
    // Calculate exact track scroll width manually to bypass CSS flex constraints
    const cards = track.querySelectorAll('.work-card');
    const cardWidth = cards.length > 0 ? cards[0].offsetWidth + 32 : 0; // +32 for 2rem gap
    // On mobile (≤900px) only 1 card is visible at a time; desktop shows 3
    const visibleCards = window.innerWidth <= 900 ? 1 : 3;
    const scrollableCards = Math.max(0, cards.length - visibleCards);
    const maxScroll = cardWidth * scrollableCards;
    
    // Apply horizontal transform based on ratio
    track.style.transform = `translateX(-${ratio * maxScroll}px)`;
    
    // Update progress bar
    if (progress) {
      progress.style.width = `${ratio * 100}%`;
    }
  }

  // Use requestAnimationFrame on scroll for smoother performance
  let ticking = false;
  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateGallery();
        ticking = false;
      });
      ticking = true;
    }
  }

  // Use capture: true to catch ALL scroll events, even if body/html is the scrolling element
  window.addEventListener('scroll', onScroll, { capture: true, passive: true });
  document.addEventListener('scroll', onScroll, { capture: true, passive: true });
  document.body.addEventListener('scroll', onScroll, { capture: true, passive: true });
  window.addEventListener('resize', updateGallery);
  updateGallery();
}

/**
 * Handle Contact Form Submission via Web3Forms API
 */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const submitBtn = document.getElementById('footer-send-btn');

  if (!form || !submitBtn) return;

  form.addEventListener('submit', async function(e) {
    e.preventDefault();

    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    const formData = new FormData(form);

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        submitBtn.textContent = 'Sent!';
        form.reset();
        
        // Revert back after 3 seconds
        setTimeout(() => {
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
        }, 3000);
      } else {
        submitBtn.textContent = 'Error! Try Again';
        submitBtn.disabled = false;
        setTimeout(() => {
          submitBtn.textContent = originalText;
        }, 3000);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      submitBtn.textContent = 'Error! Try Again';
      submitBtn.disabled = false;
      setTimeout(() => {
        submitBtn.textContent = originalText;
      }, 3000);
    }
  });
}

/**
 * Scroll-Driven Reveal — Sequential cascade like a UTP cable tester.
 * Observes each SECTION. When a section enters the viewport, it reveals
 * its .reveal children ONE BY ONE with a 220ms gap between each.
 */
function initScrollReveal() {
  // Group .reveal elements by their closest section/parent container
  const sections = document.querySelectorAll(
    '.hero-wrapper, .about-section, .empty-section, .works-scroll-section, .certificates-section, .site-footer, .footer-wrap'
  );

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const revealEls = entry.target.querySelectorAll('.reveal:not(.revealed)');
        // Cascade one by one — like LEDs lighting up sequentially
        revealEls.forEach((el, i) => {
          setTimeout(() => {
            el.classList.add('revealed');

            // If it's a skill bar item, animate the percentage number alongside the bar fill
            if (el.classList.contains('skill-bar-item')) {
              const percentEl = el.querySelector('.skill-bar-percent');
              if (percentEl) {
                const targetText = percentEl.innerText.replace('%', '').trim();
                const targetValue = parseInt(targetText);
                if (!isNaN(targetValue)) {
                  let count = 0;
                  const duration = 1500; // 1.5s matches the CSS width transition
                  const interval = 30; // ms per frame
                  const step = targetValue / (duration / interval);
                  
                  const counterId = setInterval(() => {
                    count += step;
                    if (count >= targetValue) {
                      count = targetValue;
                      clearInterval(counterId);
                    }
                    percentEl.innerText = Math.floor(count) + '%';
                  }, interval);
                }
              }
            }
          }, i * 220); // 220ms between each element
        });
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -30px 0px'
  });

  sections.forEach(sec => observer.observe(sec));
}

/**
 * Hero Auto-Reveal — cascades hero elements one by one after entrance finishes.
 */
function initHeroReveal() {
  const heroReveals = document.querySelectorAll('.hero-content .reveal');
  if (!heroReveals.length) return;

  heroReveals.forEach((el, i) => {
    setTimeout(() => {
      el.classList.add('revealed');
    }, 2000 + (i * 300)); // 2s entrance wait + 300ms per element
  });
}

/**
 * Mobile Burger Menu Toggle
 */
function initBurgerMenu() {
  const burgerMenu = document.getElementById('burger-menu');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = navMenu ? navMenu.querySelectorAll('a') : [];

  if (!burgerMenu || !navMenu) return;

  burgerMenu.addEventListener('click', (e) => {
    e.stopPropagation();
    navMenu.classList.toggle('active');
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('active');
    });
  });

  document.addEventListener('click', (e) => {
    if (!navMenu.contains(e.target) && e.target !== burgerMenu && !burgerMenu.contains(e.target)) {
      navMenu.classList.remove('active');
    }
  });
}

