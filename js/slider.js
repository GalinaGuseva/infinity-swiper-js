window.addEventListener('load', () => {
  const wrapper = document.querySelector('.review-wrapper'),
    slides = document.querySelector('.review__slides'),
    dots = document.querySelectorAll('.review-dot'),
    leftArrow = document.querySelector('.review-prev'),
    rightArrow = document.querySelector('.review-next'),
    slidesChildrens = [...slides.children],
    totalSlides = slidesChildrens.length;

  let isDragging = false,
    isAutoPlay = false,
    startX,
    startScrollLeft,
    firstCardWidth = slides.querySelector('.review-box').offsetWidth;

  // Получите количество карточек, которые могут поместиться в карусели одновременно
  let cardPerView = Math.round(slides.offsetWidth / firstCardWidth);

  // Вставьте копии последних нескольких карточек в начало карусели для бесконечной прокрутки.
  slidesChildrens
    .slice(-cardPerView)
    .reverse()
    .forEach((card) => {
      slides.insertAdjacentHTML('afterbegin', card.outerHTML);
    });

  // Вставьте копии первых нескольких карточек в конец карусели для бесконечной прокрутки.
  slidesChildrens.slice(0, cardPerView).forEach((card) => {
    slides.insertAdjacentHTML('beforeend', card.outerHTML);
  });

  // Прокрутите карусель в нужноe местo, чтобы скрыть первые несколько дубликатов карточек в Firefox.
  slides.classList.add('no-transition');
  slides.scrollLeft = slides.offsetWidth;
  slides.classList.remove('no-transition');

  function currentIndex() {
    return Math.round(slides.scrollLeft / firstCardWidth - 2);
  }

  function goto(index) {
    slides.scrollLeft += firstCardWidth * index;
  }
  for (let i = 0; i < totalSlides; i++) {
    dots[i].addEventListener('click', () => goto(i));
  }

  function markDot(index) {
    dots[index].classList.add('active');
    dots[index].setAttribute('aria-disabled', 'true');
  }

  function clearDot() {
    dots.forEach((dot) => {
      dot.classList.remove('active');
      dot.setAttribute('aria-disabled', 'false');
    });
  }
  function updateDot() {
    let c = currentIndex();
    if (c < 0) {
      c = totalSlides - 1;
    } else if (c >= totalSlides) {
      c = 0;
    }
    markDot(c);
  }

  const dragStart = (e) => {
    isDragging = true;
    slides.classList.add('dragging');
    //Записывает начальное положение курсора и прокрутки карусели.
    startX = e.pageX;
    startScrollLeft = slides.scrollLeft;
  };

  const dragging = (e) => {
    if (!isDragging) return; // если isDragging ложно, вернитесь отсюда
    // Обновляет позицию прокрутки карусели на основе перемещения курсора
    slides.scrollLeft = startScrollLeft - (e.pageX - startX);
  };

  const dragStop = () => {
    isDragging = false;
    slides.classList.remove('dragging');
  };
  // Если карусель находится в начале, прокрутите до конца
  function rewind() {
    slides.classList.add('no-transition');
    slides.scrollLeft = slides.scrollWidth - 2 * slides.offsetWidth;
    slides.classList.remove('no-transition');
  }
  // Если карусель в конце, прокрутите в начало
  function forward() {
    slides.classList.add('no-transition');
    slides.scrollLeft = slides.offsetWidth;
    slides.classList.remove('no-transition');
  }

  let scrollTimer;
  const infiniteScroll = () => {
    clearDot();
    if (scrollTimer) clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => {
      if (slides.scrollLeft === 0) {
        rewind();
      } else if (
        Math.ceil(slides.scrollLeft) ===
        slides.scrollWidth - slides.offsetWidth
      ) {
        forward();
      }
    }, 100);
    updateDot();
  };

  let resizeTimer;
  window.addEventListener('resize', () => {
    firstCardWidth = slides.children[0].offsetWidth;
    if (resizeTimer) clearTimeout(resizeTimer);
    stop();
    resizeTimer = setTimeout(() => {
      play();
    }, 400);
  });

  function next() {
    slides.scrollLeft += firstCardWidth;
  }
  const pause = 2500;
  let itv;
  function play() {
    // early return if the user prefers reduced motion
    if (
      window.innerWidth < 800 ||
      !isAutoPlay //||
      //window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }
    clearInterval(itv);
    wrapper.setAttribute('aria-live', 'off');
    itv = setInterval(next, pause);
  }

  function stop() {
    clearInterval(itv);
    wrapper.setAttribute('aria-live', 'polite');
  }
  const observer = new IntersectionObserver(callback, { threshold: 0.99 });
  observer.observe(wrapper);

  function callback(entries, observer) {
    entries.forEach((entry) => {
      console.log(`entry.intersectionRatio: ${entry.intersectionRatio}`);
      if (entry.isIntersecting) {
        console.log(`entry.isIntersecting is true.`);
        play();
      } else {
        console.log(`entry.isIntersecting is false.`);
        stop();
      }
    });
  }

  rightArrow.addEventListener('click', () => {
    slides.scrollLeft += firstCardWidth;
  });
  leftArrow.addEventListener('click', () => {
    slides.scrollLeft -= firstCardWidth;
  });

  slides.addEventListener('mousedown', dragStart);
  slides.addEventListener('mousemove', dragging);
  document.addEventListener('mouseup', dragStop);
  slides.addEventListener('scroll', infiniteScroll);
  wrapper.addEventListener('pointerenter', () => stop());
  wrapper.addEventListener('pointerleave', () => play());
  // for keyboard users
  wrapper.addEventListener('focus', () => stop(), true);
  wrapper.addEventListener(
    'blur',
    () => {
      if (wrapper.matches(':hover')) return;
      play();
    },
    true
  );
  // for touch device users
  wrapper.addEventListener('touchstart', () => stop());
});
