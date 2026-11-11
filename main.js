document.documentElement.classList.add('js');

const menu = document.querySelector('.menu');
const navigation = document.querySelector('#navigation');

function setMenu(open) {
  navigation.classList.toggle('open', open);
  menu.setAttribute('aria-expanded', String(open));
}

menu.addEventListener('click', () => {
  setMenu(menu.getAttribute('aria-expanded') !== 'true');
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') {
    setMenu(false);
    menu.focus();
  }
});

window.matchMedia('(max-width: 760px)').addEventListener('change', () => setMenu(false));

document.querySelector('[data-year]').textContent = new Date().getFullYear();

const hero = document.querySelector('.hero');
if (hero) {
  const slides = [...hero.querySelectorAll('.slide')];
  const controls = hero.querySelector('.slide-controls');
  const dots = [...controls.querySelectorAll('[data-slide]')];
  const pause = controls.querySelector('.pause');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let index = 0;
  let playing = !reducedMotion.matches;
  let hovered = false;
  let timer;

  function showSlide(next) {
    index = next;
    slides.forEach((slide, position) => {
      slide.hidden = position !== index;
      dots[position].setAttribute('aria-current', String(position === index));
    });
  }

  function schedule() {
    window.clearTimeout(timer);
    pause.textContent = playing ? 'Pause slideshow' : 'Play slideshow';
    if (playing && !hovered && !document.hidden && !hero.contains(document.activeElement)) {
      timer = window.setTimeout(() => {
        showSlide((index + 1) % slides.length);
        schedule();
      }, 7000);
    }
  }

  dots.forEach((dot, position) => dot.addEventListener('click', () => {
    showSlide(position);
    schedule();
  }));
  pause.addEventListener('click', () => {
    playing = !playing;
    schedule();
  });
  hero.addEventListener('pointerenter', (event) => {
    if (event.pointerType === 'mouse') {
      hovered = true;
      schedule();
    }
  });
  hero.addEventListener('pointerleave', () => {
    hovered = false;
    schedule();
  });
  hero.addEventListener('focusin', schedule);
  hero.addEventListener('focusout', () => window.setTimeout(schedule, 0));
  document.addEventListener('visibilitychange', schedule);
  reducedMotion.addEventListener('change', (event) => {
    playing = !event.matches;
    schedule();
  });
  controls.hidden = false;
  showSlide(0);
  schedule();
}

const enquiry = document.querySelector('#enquiry');
if (enquiry) {
  const service = enquiry.elements.namedItem('service');
  const selected = new URLSearchParams(location.search).get('service');
  if ([...service.options].some((option) => option.value === selected)) {
    service.value = selected;
  }

  enquiry.addEventListener('submit', (event) => {
    event.preventDefault();
    const fields = new FormData(enquiry);
    const message = [
      'Hello Dayas Group, I would like to make an enquiry.',
      'Name: ' + fields.get('name').trim(),
      'Service: ' + service.selectedOptions[0].text,
      'Destination: ' + (fields.get('destination').trim() || 'To be discussed'),
      'Enquiry: ' + fields.get('message').trim()
    ].join('\n');
    window.open('https://wa.me/971504019045?text=' + encodeURIComponent(message), '_blank', 'noopener,noreferrer');
  });
}
