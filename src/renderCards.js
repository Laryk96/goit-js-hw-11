import { refs } from './refs';

import 'simplelightbox/dist/simple-lightbox.min.css';

function renderCards(images) {
  const markup = images.map(createCard).join(' ');

  refs.gallery.insertAdjacentHTML('beforeend', markup);
}

const createCard = function (image) {
  const {
    webformatURL,
    largeImageURL,
    tags,
    likes,
    views,
    comments,
    downloads,
  } = image;

  return `
      <a href="${largeImageURL}">
      <div class="photo-card">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes</b>
      ${likes}
    </p>
    <p class="info-item">
      <b>Views</b>
      ${views}
    </p>
    <p class="info-item">
      <b>Comments</b>
      ${comments}
    </p>
    <p class="info-item">
      <b>Downloads</b>
      ${downloads}
    </p>
  </div>
</div></a>`;
};

export { renderCards };
