const init = function () {
	const imagesList = document.querySelectorAll('.gallery__item');
	imagesList.forEach((img) => {
		img.dataset.sliderGroupName = Math.random() > 0.5 ? 'nice' : 'good';
	});

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

	const navNext = sliderRootElement.querySelector('.js-slider__nav--next');
	navNext.addEventListener('click', (e) => {
		fireCustomEvent(e.currentTarget, 'js-slider-img-next');
	});

	const navPrev = sliderRootElement.querySelector('.js-slider__nav--prev');
	navPrev.addEventListener('click', (e) => {
		fireCustomEvent(e.currentTarget, 'js-slider-img-prev');
	});

	const zoom = sliderRootElement.querySelector('.js-slider__zoom');
	zoom.addEventListener('click', (e) => {
		fireCustomEvent(e.currentTarget, 'js-slider-close');
	});
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
	// 1. dodać klasę [.js-slider--active], aby pokazać całą sekcję
	sliderRootElement.classList.add('js-slider--active');

	// 2. wyszukać ściężkę (atrybut [src]) do klikniętego elementu i wstawić do [.js-slider__image]
	const src = event.target.querySelector('img').getAttribute('src');
	const sliderImg = document.querySelector('.js-slider__image');
	sliderImg.setAttribute('src', src);

	// 3. pobrać nazwę grupy zapisaną w dataset klikniętego elementu
	const groupName = event.target.dataset.sliderGroupName;

	// 4. wyszukać wszystkie zdjęcia należące do danej grupy, które wykorzystasz do osadzenia w dolnym pasku
	const imgArr = [...document.querySelectorAll('.gallery__item')];
	const groupImagesLabel = imgArr.filter(
		(el) => el.dataset.sliderGroupName === groupName
	);

	// 5. utworzyć na podstawie elementu [.js-slider__thumbs-item--prototype] zawartość dla [.js-slider__thumbs]
	const prototypeSlider = sliderRootElement.querySelector(
		'.js-slider__thumbs-item--prototype'
	);
	displayBottomImgs(groupImagesLabel, prototypeSlider, sliderRootElement);

	// 6. zaznaczyć przy pomocy klasy [.js-slider__thumbs-image--current], który element jest aktualnie wyświetlany
	currentDisplayElement(src);
};

function displayBottomImgs(
	groupImagesLabel,
	prototypeSlider,
	sliderRootElement
) {
	groupImagesLabel.forEach((el) => {
		const sliderImgThumb = prototypeSlider.cloneNode(true);
		const src = el.querySelector('img').getAttribute('src');
		sliderImgThumb.classList.remove('js-slider__thumbs-item--prototype');
		sliderImgThumb.querySelector('img').setAttribute('src', src);
		const parent = sliderRootElement.querySelector('.js-slider__thumbs');
		parent.appendChild(sliderImgThumb);
	});
}

function currentDisplayElement(src) {
	const thumbsImgList = document.querySelectorAll('.js-slider__thumbs-image');
	thumbsImgList.forEach((el) => {
		if (el.getAttribute('src') === src) {
			el.classList.add('js-slider__thumbs-image--current');
		}
	});
}

const onImageNext = function (event) {
	// 1. wyszukać aktualny wyświetlany element przy pomocy [.js-slider__thumbs-image--current]
	const slider = document.querySelector('.js-slider');
	const currentImg = document.querySelector(
		'.js-slider__thumbs-image--current'
	);

	// 2. znaleźć element następny do wyświetlenie względem drzewa DOM dla [.js-slider__thumbs]
	const nextImgElement = currentImg.parentElement.nextElementSibling;

	// 3. sprawdzić czy ten element istnieje - jeśli nie to [.nextElementSibling] zwróci [null]
	switchToNextImg(nextImgElement, currentImg, slider);
};

function switchToNextImg(nextImgElement, currentImg, slider) {
	if (nextImgElement) {
		const nextImg = nextImgElement.firstElementChild;
		// 4. przełączyć klasę [.js-slider__thumbs-image--current] do odpowiedniego elementu
		nextImg.classList.toggle('js-slider__thumbs-image--current');
		currentImg.classList.toggle('js-slider__thumbs-image--current');
		// 5. podmienić atrybut o nazwie [src] dla [.js-slider__image]
		const nextImgSrc = nextImg.getAttribute('src');
		slider.querySelector('.js-slider__image').setAttribute('src', nextImgSrc);
	}
}

const onImagePrev = function (event) {
	// 1. wyszukać aktualny wyświetlany element przy pomocy [.js-slider__thumbs-image--current]
	const slider = document.querySelector('.js-slider');
	const currentImg = document.querySelector(
		'.js-slider__thumbs-image--current'
	);
	// 2. znaleźć element poprzedni do wyświetlenie względem drzewa DOM dla [.js-slider__thumbs]
	const beforeImgElement = currentImg.parentElement.previousElementSibling;

	// 3. sprawdzić czy ten element istnieje i czy nie posiada klasy [.js-slider__thumbs-item--prototype]
	switchToBeforeImg(beforeImgElement, currentImg, slider);
};

function switchToBeforeImg(beforeImgElement, currentImg, slider) {
	if (beforeImgElement) {
		const beforeImg = beforeImgElement.firstElementChild;
		if (beforeImg.getAttribute('src')) {
			// 4. przełączyć klasę [.js-slider__thumbs-image--current] do odpowiedniego elementu
			beforeImg.classList.toggle('js-slider__thumbs-image--current');
			currentImg.classList.toggle('js-slider__thumbs-image--current');
			// 5. podmienić atrybut [src] dla [.js-slider__image]
			const beforeImgSrc = beforeImg.getAttribute('src');
			if (beforeImgSrc) {
				slider
					.querySelector('.js-slider__image')
					.setAttribute('src', beforeImgSrc);
			}
		}
	}
}

const onClose = function (event) {
	if (event.target.classList.contains('js-slider__zoom')) {
		this.classList.remove('js-slider--active');
		removeThumbs(this.querySelector('.js-slider__thumbs'));
		console.log(event);
	}
	// todo:
	// 1. należy usunać klasę [js-slider--active] dla [.js-slider]
	// 2. należy usunać wszystkie dzieci dla [.js-slider__thumbs] pomijając [.js-slider__thumbs-item--prototype]
};

function removeThumbs(thumbsParent) {
	const childrenArr = [...thumbsParent.children];
	console.log(childrenArr);
	childrenArr.forEach((el) => {
		if (!el.classList.contains('js-slider__thumbs-item--prototype')) {
			thumbsParent.removeChild(el);
		}
	});
}
