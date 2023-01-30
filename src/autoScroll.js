// const options = {
//   rootMargin: '100px',
// };

// const loadMore = entries => {
//   entries.forEach(entry => {
//     if (entry.isIntersecting) {
//       onLoadMore();
//     }
//   });
// };
// const observer = new IntersectionObserver(loadMore, options);
// observer.observe(refs.moreImgButton);

import { refs } from './refs';
import NewApiService from './apiPixabay';

class AutoScroll {
  constructor(loadImages) {
    this.options = {
      rootMargin: '100px',
    };

    this.onLoadMore = loadImages;
  }

  loadMore(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        this.onLoadMore();
      }
    });
  }

  observer() {
    const observer = new IntersectionObserver(this.loadMore, this.options);
    observer.observe(refs.moreImgButton);
  }
}

async function onLoadMore() {
  apiServise.incrementPage();
  try {
    const images = await apiServise.featchImg();
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

export { AutoScroll, onLoadMore };
