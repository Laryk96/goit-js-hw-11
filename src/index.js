import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import NewApiService from './fetchIMG';
import { refs } from './refs';
import { renderCards } from './renderCards';

const apiServise = new NewApiService();
const simpleLightbox = new SimpleLightbox('.gallery a', {
  captions: true,
  captionsData: 'alt',
  captionPosition: 'bottom',
  captionDelay: 250,
});

refs.form.addEventListener('submit', onSubmitForm);
refs.moreImgButton.addEventListener('click', onLoadMore);
refs.moreImgButton.classList.add('hidden');

async function onSubmitForm(e) {
  e.preventDefault();
  refs.moreImgButton.classList.add('hidden');
  const inputValue = e.currentTarget.elements.searchQuery.value.trim();

  if (inputValue === '') {
    return;
  }

  refs.gallery.innerHTML = '';
  apiServise.search = inputValue;
  apiServise.resetPage();

  try {
    const images = await apiServise.featchImg();
    const amountElement = images.hits.length;

    if (amountElement === 0) {
      return Notiflix.Notify.failure('Nothing was found for your request');
    }
    Notiflix.Notify.info(`Hooray! We found ${images.total} images.`);
    renderCards(images.hits);
    simpleLightbox.refresh();
    refs.moreImgButton.classList.remove('hidden');
  } catch (error) {
    console.log(error.message);
  }
}

async function onLoadMore() {
  refs.moreImgButton.setAttribute('disabled', true);
  apiServise.incrementPage();

  try {
    const images = await apiServise.featchImg();
    const amountElement = images.hits.length;

    if (amountElement === 0) {
      refs.moreImgButton.classList.add('hidden');
      return Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
    }

    await renderCards(images.hits);
    await smoothScroll();
    await simpleLightbox.refresh();

    refs.moreImgButton.classList.remove('hidden');
    refs.moreImgButton.removeAttribute('disabled');
  } catch (error) {
    return console.log(error.message);
  }
}

function smoothScroll() {
  setTimeout(() => {
    const { height: cardHeight } = document
      .querySelector('.gallery')
      .firstElementChild.getBoundingClientRect();
    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
  }, 200);
}
