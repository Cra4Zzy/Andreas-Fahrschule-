const burger = document.querySelector('[data-burger]');
const navWrap = document.querySelector('[data-nav-wrap]');
if (burger && navWrap) {
  burger.addEventListener('click', () => {
    const expanded = burger.getAttribute('aria-expanded') === 'true';
    burger.setAttribute('aria-expanded', String(!expanded));
    navWrap.classList.toggle('is-open');
  });
}

document.querySelectorAll('[data-reveal]').forEach((el, index) => {
  el.style.transitionDelay = `${Math.min(index * 60, 280)}ms`;
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('[data-reveal]').forEach((el) => observer.observe(el));

const yearNode = document.querySelector('[data-year]');
if (yearNode) yearNode.textContent = new Date().getFullYear();

const form = document.querySelector('[data-contact-form]');
if (form) {
  const success = document.querySelector('[data-form-success]');
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const name = data.get('name')?.toString().trim() || '';
    const phone = data.get('phone')?.toString().trim() || '';
    const email = data.get('email')?.toString().trim() || '';
    const subject = data.get('subject')?.toString().trim() || 'Anfrage Schulung';
    const message = data.get('message')?.toString().trim() || '';
    const body = [
      `Name: ${name}`,
      `Telefon: ${phone}`,
      `E-Mail: ${email}`,
      '',
      'Nachricht:',
      message,
    ].join('\n');

    window.location.href = `mailto:a.abbate@t-online.de?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    if (success) success.classList.add('is-visible');
    form.reset();
  });
}

const filterButtons = document.querySelectorAll('[data-filter]');
const filterItems = document.querySelectorAll('[data-service-card]');
if (filterButtons.length && filterItems.length) {
  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const category = button.dataset.filter;
      filterButtons.forEach((btn) => btn.classList.toggle('is-active', btn === button));
      filterItems.forEach((item) => {
        const match = category === 'all' || item.dataset.category === category;
        item.style.display = match ? '' : 'none';
      });
    });
  });
}


const gallery = document.querySelector('[data-gallery-slider]');
if (gallery) {
  const track = gallery.querySelector('.gallery-track');
  const slides = Array.from(gallery.querySelectorAll('.gallery-slide'));
  const dotsWrap = gallery.querySelector('[data-gallery-dots]');
  const prev = gallery.querySelector('[data-gallery-prev]');
  const next = gallery.querySelector('[data-gallery-next]');
  let index = 0;
  let autoPlay;
  let startX = 0;
  let currentX = 0;

  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = `gallery-dot${i === 0 ? ' is-active' : ''}`;
    dot.setAttribute('aria-label', `Bild ${i + 1} anzeigen`);
    dot.addEventListener('click', () => {
      goTo(i);
      restartAutoPlay();
    });
    dotsWrap.appendChild(dot);
  });

  const dots = Array.from(dotsWrap.querySelectorAll('.gallery-dot'));

  function update() {
    track.style.transform = `translateX(-${index * 100}%)`;
    slides.forEach((slide, i) => slide.classList.toggle('is-active', i === index));
    dots.forEach((dot, i) => dot.classList.toggle('is-active', i === index));
  }

  function goTo(newIndex) {
    index = (newIndex + slides.length) % slides.length;
    update();
  }

  function startAutoPlay() {
    autoPlay = window.setInterval(() => goTo(index + 1), 2500);
  }

  function restartAutoPlay() {
    window.clearInterval(autoPlay);
    startAutoPlay();
  }

  prev?.addEventListener('click', () => {
    goTo(index - 1);
    restartAutoPlay();
  });

  next?.addEventListener('click', () => {
    goTo(index + 1);
    restartAutoPlay();
  });

  gallery.addEventListener('mouseenter', () => window.clearInterval(autoPlay));
  gallery.addEventListener('mouseleave', startAutoPlay);

  track.addEventListener('touchstart', (event) => {
    startX = event.touches[0].clientX;
    currentX = startX;
    window.clearInterval(autoPlay);
  }, { passive: true });

  track.addEventListener('touchmove', (event) => {
    currentX = event.touches[0].clientX;
  }, { passive: true });

  track.addEventListener('touchend', () => {
    const delta = currentX - startX;
    if (Math.abs(delta) > 45) {
      goTo(delta < 0 ? index + 1 : index - 1);
    }
    restartAutoPlay();
  });

  update();
  startAutoPlay();
}
