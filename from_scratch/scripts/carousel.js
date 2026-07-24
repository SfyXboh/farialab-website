function showSlide(slides, captions, dots, i) {
    slides.forEach((slide) => {slide.classList.remove('show')});
    captions.forEach((caption) => {caption.classList.remove('show')});
    dots.forEach((dot) => {dot.classList.remove('show')});
    
    slides[i].classList.add('show');
    captions[i].classList.add('show');
    dots[i].classList.add('show');
}

function showNext(slides, captions, dots, currentslides, c) {
    showSlide(slides, captions, dots, currentslides[c]);
    currentslides[c] += 1;
    currentslides[c] %= slides.length;
}

let carousels = document.querySelectorAll('.carousel');
let dots = document.querySelectorAll('.dots');
let currentslides = Array(carousels.length);

/* initialize current slide */
for (let c = 0; c < carousels.length; c++) {
    currentslides[c] = 1;
}

/* auto next */
for (let c = 0; c < carousels.length; c++) {
    setInterval(() => showNext(carousels[c].querySelectorAll('.slide'), carousels[c].querySelectorAll('.caption'), dots[c].querySelectorAll('.dot'), currentslides, c), 10000);
}