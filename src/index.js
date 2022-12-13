import Notiflix from 'notiflix';
import NewApiService from './fetchIMG';
import { refs } from './refs';
import { renderCards } from './renderCards';

const apiServise = new NewApiService();

refs.form.addEventListener('submit', onSubmitForm);
refs.moreImgButton.addEventListener('click', onLoadMore);
refs.moreImgButton.classList.add('hidden');

function onSubmitForm(e) {
  e.preventDefault();
  refs.gallery.innerHTML = '';

  const inputValue = e.currentTarget.elements.searchQuery.value;

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
      refs.moreImgButton.classList.remove('hidden');
    })
    .catch(error => console.log(error.message))
    .finally(refs.moreImgButton.removeAttribute('disabled'));
}
