const init = function () {
	const imagesList = document.querySelectorAll('.gallery__item');
	imagesList.forEach((img) => {
		img.dataset.sliderGroupName = Math.random() > 0.5 ? 'nice' : 'good';
	}); // za każdym przeładowaniem strony przydzielaj inną nazwę grupy dla zdjęcia

	runJSSlider();
};

document.addEventListener('DOMContentLoaded', init);

const runJSSlider = function () {
	const imagesSelector = '.gallery__item';
	const sliderRootSelector = '.js-slider';

	const imagesList = document.querySelectorAll(imagesSelector);
	const sliderRootElement = document.querySelector(sliderRootSelector);

	initEvents(imagesList, sliderRootElement);
	initCustomEvents(imagesList, sliderRootElement, imagesSelector);
};

const initEvents = function (imagesList, sliderRootElement) {
	imagesList.forEach(function (item) {
		item.addEventListener('click', function (e) {
			fireCustomEvent(e.currentTarget, 'js-slider-img-click');
		});
	});

	// todo:
	// utwórz nasłuchiwanie eventu o nazwie [click], który ma uruchomić event [js-slider-img-next]
	// na elemencie [.js-slider__nav--next]
	const navNext = sliderRootElement.querySelector('.js-slider__nav--next');
	navNext.addEventListener(
		'click',
		fireCustomEvent(navNext, 'js-slider-img-next')
	);

	// todo:
	// utwórz nasłuchiwanie eventu o nazwie [click], który ma uruchomić event [js-slider-img-prev]
	// na elemencie [.js-slider__nav--prev]
	const navPrev = sliderRootElement.querySelector('.js-slider__nav--prev');
	navPrev.addEventListener(
		'click',
		fireCustomEvent(navPrev, 'js-slider-img-prev')
	);

	// todo:
	// utwórz nasłuchiwanie eventu o nazwie [click], który ma uruchomić event [js-slider-close]
	// tylko wtedy, gdy użytkownik kliknie w [.js-slider__zoom]
	const zoom = sliderRootElement.querySelector('.js-slider__zoom');
	zoom.addEventListener('click', fireCustomEvent(zoom, 'js-slider-close'));
};

const fireCustomEvent = function (element, name) {
	// console.log(element.className, '=>', name);

	const event = new CustomEvent(name, {
		bubbles: true,
	});

	element.dispatchEvent(event);
};

const initCustomEvents = function (
	imagesList,
	sliderRootElement,
	imagesSelector
) {
	imagesList.forEach(function (img) {
		img.addEventListener('js-slider-img-click', function (event) {
			onImageClick(event, sliderRootElement, imagesSelector);
		});
	});

	sliderRootElement.addEventListener('js-slider-img-next', onImageNext);
	sliderRootElement.addEventListener('js-slider-img-prev', onImagePrev);
	sliderRootElement.addEventListener('js-slider-close', onClose);
};

const onImageClick = function (event, sliderRootElement, imagesSelector) {
	// todo:
	sliderRootElement.classList.add('js-slider--active');
	const src = event.target.querySelector('img').getAttribute('src');
	const sliderImg = document.querySelector('.js-slider__image');
	sliderImg.setAttribute('src', src);
	console.log(sliderImg);

	const groupNames = document.querySelectorAll('.gallery__item');
	groupNames.forEach((el) => {
		console.log(el.getAttribute('data-slider-group-name'));
	})

	// 1. dodać klasę [.js-slider--active], aby pokazać całą sekcję
	// 2. wyszukać ściężkę (atrybut [src]) do klikniętego elementu i wstawić do [.js-slider__image]

	// 3. pobrać nazwę grupy zapisaną w dataset klikniętego elementu

	// 4. wyszukać wszystkie zdjęcia należące do danej grupy, które wykorzystasz do osadzenia w dolnym pasku
	// 5. utworzyć na podstawie elementu [.js-slider__thumbs-item--prototype] zawartość dla [.js-slider__thumbs]
	// 6. zaznaczyć przy pomocy klasy [.js-slider__thumbs-image--current], który element jest aktualnie wyświetlany
};

const onImageNext = function (event) {
	console.log(this, 'onImageNext');
	// [this] wskazuje na element [.js-slider]

	// todo:
	// 1. wyszukać aktualny wyświetlany element przy pomocy [.js-slider__thumbs-image--current]
	// 2. znaleźć element następny do wyświetlenie względem drzewa DOM dla [.js-slider__thumbs]
	// 3. sprawdzić czy ten element istnieje - jeśli nie to [.nextElementSibling] zwróci [null]
	// 4. przełączyć klasę [.js-slider__thumbs-image--current] do odpowiedniego elementu
	// 5. podmienić atrybut o nazwie [src] dla [.js-slider__image]
};

const onImagePrev = function (event) {
	console.log(this, 'onImagePrev');
	// [this] wskazuje na element [.js-slider]

	// todo:
	// 1. wyszukać aktualny wyświetlany element przy pomocy [.js-slider__thumbs-image--current]
	// 2. znaleźć element poprzedni do wyświetlenie względem drzewa DOM dla [.js-slider__thumbs]
	// 3. sprawdzić czy ten element istnieje i czy nie posiada klasy [.js-slider__thumbs-item--prototype]
	// 4. przełączyć klasę [.js-slider__thumbs-image--current] do odpowiedniego elementu
	// 5. podmienić atrybut [src] dla [.js-slider__image]
};

const onClose = function (event) {
	// todo:
	// 1. należy usunać klasę [js-slider--active] dla [.js-slider]
	// 2. należy usunać wszystkie dzieci dla [.js-slider__thumbs] pomijając [.js-slider__thumbs-item--prototype]
};
