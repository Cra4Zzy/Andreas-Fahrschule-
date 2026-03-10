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
