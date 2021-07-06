// Images collection
const sliderImages = [
    'images/bmw.jpg',
    'images/lamborgini.jpg',
    'images/mustang.jpg',
    'images/porsche.jpg',
    'images/maserati.jpg',
];

// Slider options configuration
const sliderOptions = {
    currentSlideIndex: 0,
    duration: 750,
    slideShowInterval: 4000,
    fill: 'forwards',
    easing: 'cubic-bezier(0.250, 0.460, 0.450, 0.940)',
};

// animateAsync

const animateAsync = (element, keyframes, options) => {
    return new Promise(res => {
        const anim = element.animate(keyframes, options);
        setTimeout(res, options.duration || 0);
    });
};

// Slider

const createImageSlider = (images, options = {}) => {
    let {
        currentSlideIndex,
        duration,
        slideShowInterval,
        fill,
        easing,
    } = options;
    let timer = null;
    let animating = false;

    const slider = document.createElement('div');
    slider.className = 'slider';
    slider.innerHTML = `
        <div class="slider__wrapper"></div>
        <div class="slider__indicators"></div>
        <button type="button" class="slider__prev-btn"></button>
        <button type="button" class="slider__next-btn"></button>
    `;
    const [wrapper, indicators, prevBtn, nextBtn] = slider.children;

    images.forEach((src, idx) => {
        // Create slide elements
        const slide = document.createElement('div');
        const btn = document.createElement('button');
        const image = document.createElement('img');

        // Append classes and src to slide elements
        image.src = src;
        slide.classList.add('slider__slide');
        btn.classList.add('slider__indicator-btn');
        btn.style.transitionDuration = `${duration}ms`;

        const modificator = idx === currentSlideIndex ? 'active' : '';
        if (modificator) {
            slide.classList.add(`slider__slide--${modificator}`);
            btn.classList.add(`slider__indicator--${modificator}`);
        }

        // Binding switch button handler
        btn.addEventListener('click', () => {
            slideTo(idx);
        });

        // Append slide elements to slider
        slide.appendChild(image);
        wrapper.appendChild(slide);
        indicators.appendChild(btn);
    });

    const slideTo = idx => {
        if (idx === currentSlideIndex || animating) return;
        animating = true;

        clearTimeout(timer);

        const currentSlide = wrapper.children[currentSlideIndex];
        const nextSlide = wrapper.children[idx];

        indicators.children[currentSlideIndex].classList.remove(
            'slider__indicator--active'
        );
        indicators.children[idx].classList.add('slider__indicator--active');
        const pos = idx > currentSlideIndex ? '-100%' : '100%';

        Promise.all([
            animateAsync(
                nextSlide,
                [
                    { transform: `translate(${parseInt(pos, 10) * -1}%, 0)` },
                    { transform: 'translate(0, 0)' },
                ],
                { duration, fill, easing }
            ),
            animateAsync(
                currentSlide,
                [
                    { transform: 'translate(0, 0)' },
                    { transform: `translate(${pos}, 0)` },
                ],
                { duration, fill, easing }
            ),
        ]).then(() => {
            currentSlideIndex = idx;
            currentSlide.classList.remove('slider__slide--active');
            nextSlide.classList.add('slider__slide--active');
            animating = false;
            autoSlide();
        });
    };

    const autoSlide = () => {
        timer = setTimeout(() => {
            let nextSlide =
                currentSlideIndex === images.length - 1
                    ? 0
                    : currentSlideIndex + 1;
            slideTo(nextSlide);
        }, slideShowInterval);
    };

    // Binding switch buttons handler
    nextBtn.addEventListener('click', () => {
        slideTo(Math.min(currentSlideIndex + 1, images.length - 1));
    });

    prevBtn.addEventListener('click', () => {
        slideTo(Math.max(0, currentSlideIndex - 1));
    });

    // Run auto switch slides
    autoSlide();

    return slider;
};

// Append slider to DOM
document.body.append(createImageSlider(sliderImages, sliderOptions));
