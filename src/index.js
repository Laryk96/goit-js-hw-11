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

function onSubmitForm(e) {
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
    apiServise.featchImg().then(images => {
      const amountElement = images.data.hits.length;
      if (amountElement === 0) {
        return Notiflix.Notify.failure('Nothing was found for your request');
      }
      Notiflix.Notify.info(`Hooray! We found ${images.data.totalHits} images.`);
      renderCards(images);
      simpleLightbox.refresh();
      refs.moreImgButton.classList.remove('hidden');
    });
  } catch (error) {
    console.log(error.message);
  }
}

function onLoadMore() {
  refs.moreImgButton.setAttribute('disabled', true);
  apiServise.incrementPage();

  try {
    apiServise.featchImg().then(images => {
      const amountElement = images.data.hits.length;

      if (amountElement === 0) {
        refs.moreImgButton.classList.add('hidden');
        return Notiflix.Notify.info(
          "We're sorry, but you've reached the end of search results."
        );
      }

      renderCards(images);
      smoothScroll();
      simpleLightbox.refresh();
    });
  } catch (error) {
    return console.log(error.message);
  }

  refs.moreImgButton.classList.remove('hidden');
  refs.moreImgButton.removeAttribute('disabled');
}

function smoothScroll() {
  setTimeout(() => {
    const { height: cardHeight } = document
      .querySelector('.gallery')
      .firstElementChild.getBoundingClientRect();
    window.scrollBy({
      top: cardHeight * 50,
      behavior: 'smooth',
    });
  }, 200);
}
