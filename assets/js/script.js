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
		e.stopPropagation();
	});

	const navPrev = sliderRootElement.querySelector('.js-slider__nav--prev');
	navPrev.addEventListener('click', (e) => {
		fireCustomEvent(e.currentTarget, 'js-slider-img-prev');
		e.stopPropagation();
	});

	const zoom = sliderRootElement.querySelector('.js-slider__zoom');
	zoom.addEventListener('click', (e) => {
		fireCustomEvent(e.currentTarget, 'js-slider-close');
	});
};

const fireCustomEvent = function (element, name) {
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
	sliderRootElement.classList.add('js-slider--active');
	const src = event.target.querySelector('img').getAttribute('src');
	const sliderImg = document.querySelector('.js-slider__image');
	sliderImg.setAttribute('src', src);
	const groupName = event.target.dataset.sliderGroupName;
	const imgArr = [...document.querySelectorAll('.gallery__item')];
	const groupImagesLabel = imgArr.filter(
		(el) => el.dataset.sliderGroupName === groupName
	);
	const prototypeSlider = sliderRootElement.querySelector(
		'.js-slider__thumbs-item--prototype'
	);
	displayBottomImgs(groupImagesLabel, prototypeSlider, sliderRootElement);
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
	const currImg = document.querySelector('.js-slider__thumbs-image--current');
	const parentCurrImg = currImg.parentElement;
	const elementAfterParent = parentCurrImg.nextElementSibling;
	switchToNextImg(currImg, elementAfterParent);
};

function switchToNextImg(currImg, elementAfterParent) {
	if (elementAfterParent) {
		const nextImg = elementAfterParent.querySelector('img');
		currImg.classList.toggle('js-slider__thumbs-image--current');
		nextImg.classList.toggle('js-slider__thumbs-image--current');
		const sliderImg = document.querySelector('.js-slider__image');
		const nextImgSrc = nextImg.getAttribute('src');
		sliderImg.setAttribute('src', nextImgSrc);
	} else {
		const firstImg = currImg.parentElement.parentElement
			.querySelector('*:nth-child(2)')
			.querySelector('img');
		currImg.classList.toggle('js-slider__thumbs-image--current');
		firstImg.classList.toggle('js-slider__thumbs-image--current');
		const sliderImg = document.querySelector('.js-slider__image');
		const firstImgSrc = firstImg.getAttribute('src');
		sliderImg.setAttribute('src', firstImgSrc);
	}
}

const onImagePrev = function (event) {
	const currImg = document.querySelector('.js-slider__thumbs-image--current');
	const parentCurrImg = currImg.parentElement;
	const elementBeforeParent = parentCurrImg.previousElementSibling;
	switchToBeforeImg(currImg, elementBeforeParent);
};

function switchToBeforeImg(currImg, elementBeforeParent) {
	if (
		!elementBeforeParent.classList.contains('js-slider__thumbs-item--prototype')
	) {
		const prevImg = elementBeforeParent.querySelector('img');
		currImg.classList.toggle('js-slider__thumbs-image--current');
		prevImg.classList.toggle('js-slider__thumbs-image--current');
		const sliderImg = document.querySelector('.js-slider__image');
		const newSrcCurr = prevImg.getAttribute('src');
		sliderImg.setAttribute('src', newSrcCurr);
	} else {
		const lastImg =
			currImg.parentElement.parentElement.lastElementChild.querySelector('img');
		currImg.classList.toggle('js-slider__thumbs-image--current');
		lastImg.classList.toggle('js-slider__thumbs-image--current');
		const sliderImg = document.querySelector('.js-slider__image');
		const newSrcCurr = lastImg.getAttribute('src');
		sliderImg.setAttribute('src', newSrcCurr);
	}
}

const onClose = function (event) {
	if (event.target.classList.contains('js-slider__zoom')) {
		this.classList.remove('js-slider--active');
		removeThumbs(this.querySelector('.js-slider__thumbs'));
	}
};

function removeThumbs(thumbsParent) {
	const childrenArr = [...thumbsParent.children];
	childrenArr.forEach((el) => {
		if (!el.classList.contains('js-slider__thumbs-item--prototype')) {
			thumbsParent.removeChild(el);
		}
	});
}
