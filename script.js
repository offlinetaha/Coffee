// ===== Sarone Coffee - Main JavaScript =====

document.addEventListener('DOMContentLoaded', () => {

  // ===== Mobile Menu Toggle =====
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileNav = document.getElementById('mobile-nav');

  if (mobileMenuBtn && mobileNav) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileNav.classList.toggle('open');
      const spans = mobileMenuBtn.querySelectorAll('span');
      if (mobileNav.classList.contains('open')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
      } else {
        spans[0].style.transform = '';
        spans[1].style.opacity = '';
        spans[2].style.transform = '';
      }
    });

    // Close mobile menu when clicking a link
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('open');
        const spans = mobileMenuBtn.querySelectorAll('span');
        spans[0].style.transform = '';
        spans[1].style.opacity = '';
        spans[2].style.transform = '';
      });
    });
  }

  // ===== Active Nav Link on Scroll =====
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function updateActiveNav() {
    const scrollY = window.scrollY + 120;
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          const href = link.getAttribute('href');
          if (href === '#' + sectionId || (sectionId === 'hero' && href === '#')) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });

  // ===== Navbar Shadow on Scroll =====
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 10) {
      navbar.style.boxShadow = '0 2px 20px rgba(45, 22, 16, 0.1)';
    } else {
      navbar.style.boxShadow = '0 1px 12px rgba(45, 22, 16, 0.06)';
    }
  }, { passive: true });

  // ===== Scroll Animations (Intersection Observer) =====
  const animatedElements = document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right');

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.15
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  animatedElements.forEach(el => observer.observe(el));

  // ===== Coffee Card Carousel Navigation =====
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  const coffeeCardsContainer = document.getElementById('coffee-cards');

  if (prevBtn && nextBtn && coffeeCardsContainer) {
    // Additional coffee items for carousel effect
    const extraCoffees = [
      {
        name: 'Cappuccino',
        desc: 'A perfect balance of espresso, steamed milk, and a thick layer of velvety foam.',
        price: '$5.25',
        img: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=300&q=80'
      },
      {
        name: 'Mocha',
        desc: 'Rich espresso blended with premium chocolate and steamed milk, topped with whipped cream.',
        price: '$6.00',
        img: 'https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?w=300&q=80'
      },
      {
        name: 'Americano',
        desc: 'Bold espresso diluted with hot water for a clean, rich coffee experience.',
        price: '$4.00',
        img: 'https://images.unsplash.com/photo-1551030173-122aabc4489c?w=300&q=80'
      },
      {
        name: 'Macchiato',
        desc: 'Espresso stained with a small amount of foamed milk, bold and intense flavor.',
        price: '$4.75',
        img: 'https://images.unsplash.com/photo-1485808191679-5f86510681a2?w=300&q=80'
      }
    ];

    let currentPage = 0;
    const pages = [
      coffeeCardsContainer.innerHTML, // Original page
    ];

    // Create second page HTML
    let page2Html = '';
    extraCoffees.forEach(coffee => {
      page2Html += `
        <div class="coffee-card fade-in visible">
          <img src="${coffee.img}" alt="${coffee.name}" class="coffee-card-img">
          <h3>${coffee.name}</h3>
          <p>${coffee.desc}</p>
          <div class="coffee-card-footer">
            <span class="coffee-price">${coffee.price}</span>
            <button class="coffee-add-btn" aria-label="Add to cart" data-name="${coffee.name}" data-price="${coffee.price.replace('$', '')}">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            </button>
          </div>
        </div>
      `;
    });
    pages.push(page2Html);

    function navigateCards(direction) {
      currentPage += direction;
      if (currentPage < 0) currentPage = pages.length - 1;
      if (currentPage >= pages.length) currentPage = 0;

      coffeeCardsContainer.style.opacity = '0';
      coffeeCardsContainer.style.transform = direction > 0 ? 'translateX(30px)' : 'translateX(-30px)';

      setTimeout(() => {
        coffeeCardsContainer.innerHTML = pages[currentPage];
        coffeeCardsContainer.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
        coffeeCardsContainer.style.opacity = '1';
        coffeeCardsContainer.style.transform = 'translateX(0)';

        // Re-attach add-to-cart listeners
        attachAddToCartListeners();
      }, 250);
    }

    prevBtn.addEventListener('click', () => navigateCards(-1));
    nextBtn.addEventListener('click', () => navigateCards(1));
  }

  // ===== Add to Cart Functionality =====
  const cartToast = document.getElementById('cart-toast');
  const cartToastText = document.getElementById('cart-toast-text');
  let toastTimeout;

  function showToast(itemName) {
    if (cartToastText) {
      cartToastText.textContent = `${itemName} added to cart!`;
    }
    cartToast.classList.add('show');

    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      cartToast.classList.remove('show');
    }, 2500);
  }

  function attachAddToCartListeners() {
    document.querySelectorAll('.coffee-add-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const name = btn.getAttribute('data-name');

        // Button animation
        btn.style.transform = 'scale(0.85)';
        setTimeout(() => {
          btn.style.transform = 'scale(1.15)';
          setTimeout(() => {
            btn.style.transform = '';
          }, 150);
        }, 100);

        showToast(name);
      });
    });
  }

  attachAddToCartListeners();

  // ===== Smooth Scroll for Nav Links =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const navHeight = navbar.offsetHeight;
        const targetPosition = target.offsetTop - navHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ===== Newsletter Form =====
  const newsletterForm = document.getElementById('newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = newsletterForm.querySelector('input');
      const btn = newsletterForm.querySelector('button');

      btn.textContent = 'Subscribed!';
      btn.style.background = '#27ae60';
      input.value = '';

      setTimeout(() => {
        btn.textContent = 'Subscribe';
        btn.style.background = '';
      }, 3000);
    });
  }

  // ===== Parallax-like Effect on Hero =====
  const heroBg = document.querySelector('.hero-bg img');
  if (heroBg) {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      if (scrolled < 800) {
        heroBg.style.transform = `translateY(${scrolled * 0.15}px) scale(1.05)`;
      }
    }, { passive: true });
  }

  // ===== Counter Animation for Stats (if visible) =====
  function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        element.textContent = target;
        clearInterval(timer);
      } else {
        element.textContent = Math.floor(start);
      }
    }, 16);
  }

  // ===== Typing Effect for Hero (subtle) =====
  const heroTitle = document.querySelector('.hero-content h1');
  if (heroTitle) {
    heroTitle.style.opacity = '0';
    setTimeout(() => {
      heroTitle.style.transition = 'opacity 0.8s ease';
      heroTitle.style.opacity = '1';
    }, 300);
  }

});
