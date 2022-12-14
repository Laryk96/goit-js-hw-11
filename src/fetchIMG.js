import axios from 'axios';
const API_KEY = '32042455-62ff17051f805cdef5e52ab83';
const BASE_URL = 'https://pixabay.com/api/';

export default class NewApiService {
  constructor() {
    this._search = '';
    this.page = 1;
  }

  featchImg() {
    const searchParams = new URLSearchParams({
      key: API_KEY,
      q: this._search,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      page: this.page,
      per_page: 20,
    });
    const url = `${BASE_URL}?${searchParams}`;

    return axios.get(url);
  }

  get search() {
    return this._search;
  }

  set search(newSearch) {
    this._search = newSearch;
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }
}
