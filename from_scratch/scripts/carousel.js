function showSlide(slides, captions, dots, i) {
    slides.forEach((slide) => {slide.classList.remove('show')});
    captions.forEach((caption) => {caption.classList.remove('show')});
    dots.forEach((dot) => {dot.classList.remove('show')});
    
    slides[i].classList.add('show');
    captions[i].classList.add('show');
    dots[i].classList.add('show');
}

function showPrev(slides, captions, dots, currentslides, c) {
    currentslides[c] -= 1;
    if (currentslides[c] < 0) {
        currentslides[c] += slides.length;
    }

    showSlide(slides, captions, dots, currentslides[c]);
}

function showNext(slides, captions, dots, currentslides, c) {
    currentslides[c] += 1;
    currentslides[c] %= slides.length;
    
    showSlide(slides, captions, dots, currentslides[c]);
}

let carousels = document.querySelectorAll('.carousel');
let dotss = document.querySelectorAll('.dots');
let currentslides = Array(carousels.length);

/* initialize current slide */
for (let c = 0; c < carousels.length; c++) {
    currentslides[c] = 0;
}

/* auto next */
for (let c = 0; c < carousels.length; c++) {
    let slides = carousels[c].querySelectorAll('.slide');
    let captions = carousels[c].querySelectorAll('.caption');
    let dots = dotss[c].querySelectorAll('.dot');
    let prev = carousels[c].querySelector('.prev');
    let next = carousels[c].querySelector('.next');

    /* auto next */
    setInterval(() => showNext(slides, captions, dots, currentslides, c), 10000);

    /*manual next and previous buttons */
    prev.addEventListener('click', () => showPrev(slides, captions, dots, currentslides, c));
    next.addEventListener('click', () => showNext(slides, captions, dots, currentslides, c));
}