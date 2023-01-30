// import NewApiService from './apiPixabay';

export default class ApiLoadMore {
  constructor() {
    this.option = {
      rootMargin: '100px',
    };
  }

  async onLoadMore() {
    apiServise.incrementPage();

    try {
      const images = await apiServise.featchImg();
      await renderCards(images.hits);
      await simpleLightbox.refresh();
    } catch (error) {
      return console.log(error.message);
    }
  }

  autoScroll(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        console.log(ApiLoadMore.onLoadMore);
        this.onLoadMore();
      }
    });
  }
}
