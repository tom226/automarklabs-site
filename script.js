const reveals = [...document.querySelectorAll('.reveal')];
const statNumbers = [...document.querySelectorAll('.stat-number')];
const marqueeTrack = document.querySelector('.marquee-track');
const siteHeader = document.querySelector('.site-header');
const navLinks = [...document.querySelectorAll('.top-nav a')];
const sectionById = new Map(
  ['services', 'products', 'why', 'contact']
    .map((id) => [id, document.getElementById(id)])
    .filter(([, el]) => el)
);

if (marqueeTrack) {
  marqueeTrack.innerHTML = marqueeTrack.innerHTML + marqueeTrack.innerHTML;
}

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.2,
    rootMargin: '0px 0px -8% 0px'
  }
);

revelsWithDelay(reveals).forEach((el) => revealObserver.observe(el));

function revelsWithDelay(elements) {
  return elements.map((el, index) => {
    el.style.transitionDelay = `${Math.min(index * 45, 320)}ms`;
    return el;
  });
}

function updateHeaderState() {
  if (!siteHeader) {
    return;
  }
  siteHeader.classList.toggle('is-scrolled', window.scrollY > 24);
}

function updateActiveNav() {
  if (!navLinks.length || !sectionById.size) {
    return;
  }

  const marker = window.scrollY + window.innerHeight * 0.32;
  let currentId = 'services';

  sectionById.forEach((section, id) => {
    if (section && section.offsetTop <= marker) {
      currentId = id;
    }
  });

  navLinks.forEach((link) => {
    const href = link.getAttribute('href') || '';
    link.classList.toggle('is-active', href === `#${currentId}`);
  });
}

updateHeaderState();
updateActiveNav();
window.addEventListener('scroll', () => {
  updateHeaderState();
  updateActiveNav();
});

const statsObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateStats();
        observer.disconnect();
      }
    });
  },
  { threshold: 0.5 }
);

const statsContainer = document.querySelector('.hero-stats');
if (statsContainer) {
  statsObserver.observe(statsContainer);
}

function animateStats() {
  statNumbers.forEach((stat) => {
    const target = Number(stat.dataset.target || 0);
    const duration = 1400;
    const start = performance.now();

    const tick = (time) => {
      const progress = Math.min((time - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      stat.textContent = String(Math.floor(target * eased));

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        stat.textContent = String(target);
      }
    };

    requestAnimationFrame(tick);
  });
}

const canvas = document.getElementById('particle-network');
if (canvas) {
  const ctx = canvas.getContext('2d');
  const particles = [];
  const particleCount = window.innerWidth > 1100 ? 78 : 46;
  const maxDistance = window.innerWidth > 900 ? 120 : 90;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function makeParticle() {
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      size: 1.2 + Math.random() * 1.6
    };
  }

  function init() {
    resize();
    particles.length = 0;
    for (let i = 0; i < particleCount; i += 1) {
      particles.push(makeParticle());
    }
  }

  function draw() {
    if (!ctx) {
      return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < particles.length; i += 1) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x <= 0 || p.x >= canvas.width) {
        p.vx *= -1;
      }
      if (p.y <= 0 || p.y >= canvas.height) {
        p.vy *= -1;
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(66, 143, 255, 0.45)';
      ctx.fill();

      for (let j = i + 1; j < particles.length; j += 1) {
        const q = particles[j];
        const dx = p.x - q.x;
        const dy = p.y - q.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDistance) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(110, 142, 210, ${0.2 - dist / (maxDistance * 5)})`;
          ctx.lineWidth = 0.85;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(draw);
  }

  init();
  draw();

  window.addEventListener('resize', init);
}
