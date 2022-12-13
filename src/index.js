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
  const inputValue = e.currentTarget.elements.searchQuery.value;

  if (inputValue.trim() === '') {
    return;
  }
  refs.gallery.innerHTML = '';

  apiServise.search = inputValue;
  apiServise.resetPage();
  apiServise
    .featchImg()
    .then(images => {
      if (images.hits.length === 0) {
        return Notiflix.Notify.failure('Nothing was found for your request');
      }
      Notiflix.Notify.info(`Hooray! We found ${images.totalHits} images.`);
      renderCards(images);
      simpleLightbox.refresh();
      refs.moreImgButton.classList.remove('hidden');
    })
    .catch(error => console.log(error.message));
}

function onLoadMore() {
  refs.moreImgButton.setAttribute('disabled', true);
  apiServise.incrementPage();
  apiServise
    .featchImg()
    .then(images => {
      if (images.hits.length === 0) {
        refs.moreImgButton.classList.add('hidden');
        return Notiflix.Notify.info(
          "We're sorry, but you've reached the end of search results."
        );
      }
      renderCards(images);
      simpleLightbox.refresh();
      refs.moreImgButton.classList.remove('hidden');
      smoothScroll();
    })
    .catch(error => console.log(error.message))
    .finally(refs.moreImgButton.removeAttribute('disabled'));
}

function smoothScroll() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
