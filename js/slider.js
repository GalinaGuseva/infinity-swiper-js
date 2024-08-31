window.addEventListener('load', () => {
  // const carouselContainer = document.querySelector('.review-carousel');
  const wrapper = document.querySelector('.review__slides');
  const slides = document.querySelectorAll('.review__slide');
  const navdots = document.querySelectorAll('.review-dot');
  const leftArrow = document.querySelector('.review-prev');
  const rightArrow = document.querySelector('.review-next');

  const n_slides = slides.length; //число слайдов
  const n_slidesCloned = 1; //число клонов
  let slideWidth = slides[0].offsetWidth; //ширина слайда может меняться при изменении ширины окна браузера
  let spaceBtwSlides = Number(
    window
      .getComputedStyle(wrapper)
      .getPropertyValue('grid-column-gap')
      .slice(0, -2)
  ); // ширина пробела между парой слайдов

  function index_slideCurrent() {
    //вычисляет индекс слайда, отображаемого в данный момент
    return Math.round(
      wrapper.scrollLeft / (slideWidth + spaceBtwSlides) - n_slidesCloned
    );
  }

  function goto(index) {
    wrapper.scrollTo(
      (slideWidth + spaceBtwSlides) * (index + n_slidesCloned),
      0
    );
  }
  for (let i = 0; i < n_slides; i++) {
    navdots[i].addEventListener('click', () => goto(i));
  }

  function markNavdot(index) {
    navdots[index].classList.add('active');
    navdots[index].setAttribute('aria-disabled', 'true');
  }
  function updateNavdot() {
    const c = index_slideCurrent();
    if (c < 0 || c >= n_slides) return;
    markNavdot(c);
  }
  let scrollTimer;
  wrapper.addEventListener('scroll', () => {
    navdots.forEach((navdot) => {
      navdot.classList.remove('active');
      navdot.setAttribute('aria-disabled', 'false');
    });
    if (scrollTimer) clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => {
      if (
        wrapper.scrollLeft <
        (slideWidth + spaceBtwSlides) * (n_slidesCloned - 1 / 2)
      ) {
        forward();
      }
      if (
        wrapper.scrollLeft >
        (slideWidth + spaceBtwSlides) * (n_slides - 1 + n_slidesCloned + 1 / 2)
      ) {
        rewind();
      }
    }, 100);
    updateNavdot();
  });

  const firstSlideClone = slides[0].cloneNode(true);
  wrapper.append(firstSlideClone);

  const lastSlideClone = slides[n_slides - 1].cloneNode(true);
  wrapper.prepend(lastSlideClone);

  function rewind() {
    wrapper.classList.remove('smooth-scroll');
    setTimeout(() => {
      wrapper.scrollTo((slideWidth + spaceBtwSlides) * n_slidesCloned, 0);
      wrapper.classList.add('smooth-scroll');
    }, 100);
  }

  function forward() {
    wrapper.classList.remove('smooth-scroll');
    setTimeout(() => {
      wrapper.scrollTo(
        (slideWidth + spaceBtwSlides) * (n_slides - 1 + n_slidesCloned),
        0
      );
      wrapper.classList.add('smooth-scroll');
    }, 100);
  }

  rightArrow.addEventListener('click', handleRightArrowClick);
  leftArrow.addEventListener('click', handleLeftArrowClick);

  function handleRightArrowClick() {
    navdots.forEach((navdot) => {
      navdot.classList.remove('active');
      navdot.setAttribute('aria-disabled', 'false');
    });
    let index = index_slideCurrent() + 1;
    wrapper.scrollTo(
      (slideWidth + spaceBtwSlides) * (index + n_slidesCloned),
      0
    );
    wrapper.classList.add('smooth-scroll');
    updateNavdot();
  }

  function handleLeftArrowClick() {
    navdots.forEach((navdot) => {
      navdot.classList.remove('active');
      navdot.setAttribute('aria-disabled', 'false');
    });
    wrapper.classList.add('smooth-scroll');
    let index = index_slideCurrent() - 1;
    wrapper.scrollTo(
      (slideWidth + spaceBtwSlides) * (index + n_slidesCloned),
      0
    );
    updateNavdot();
  }
  // Initialization
  goto(0);
  markNavdot(0);
  wrapper.classList.add('smooth-scroll');
});
