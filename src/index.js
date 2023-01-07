import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import NewApiService from './apiPixabay';
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
  const inputValue = e.currentTarget.elements.searchQuery.value.trim();

  if (inputValue === '') {
    return;
  }

  refs.gallery.innerHTML = '';
  apiServise.search = inputValue;
  apiServise.resetPage();

  try {
    const images = await apiServise.fetchImg();
    apiServise.counterImages = images.hits.length;

    if (apiServise.counterImages < 20) {
      refs.moreImgButton.classList.add('hidden');
    }
    if (apiServise.counterImages === 0) {
      return Notiflix.Notify.failure('Nothing was found for your request');
    }

    Notiflix.Notify.info(`Hooray! We found ${images.totalHits} images.`);

    await renderCards(images.hits);
    simpleLightbox.refresh();
    refs.moreImgButton.classList.remove('hidden');
  } catch (error) {
    console.log(error.message);
  }
}

async function onLoadMore() {
  apiServise.incrementPage();
  try {
    const images = await apiServise.fetchImg();
    apiServise.counterImages += images.hits.length;
    if (apiServise.counterImages === images.totalHits) {
      refs.moreImgButton.classList.add('hidden');
      return Notiflix.Notify.warning(
        "We're sorry, but you've reached the end of search results."
      );
    }
    await renderCards(images.hits);
    await simpleLightbox.refresh();
  } catch (error) {
    refs.moreImgButton.classList.add('hidden');
    return Notiflix.Notify.warning(
      "We're sorry, but you've reached the end of search results."
    );
  }
}

const options = {
  rootMargin: '100px',
};

const loadMore = entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      onLoadMore();
    }
  });
};
const observer = new IntersectionObserver(loadMore, options);
observer.observe(refs.moreImgButton);
