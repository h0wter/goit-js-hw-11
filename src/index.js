import Notiflix from 'notiflix';
import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import InfiniteScroll from 'infinite-scroll';
import 'simplelightbox/dist/simple-lightbox.min.css';
import './css/styles.css';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '27001286-6f78b2bfddf63080b94e291b1';
const form = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
const params = {
  key: API_KEY,
  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: true,
  page: 1,
  per_page: 40,
};
let gallerySimpleLightbox = null;
form.addEventListener('submit', onFormSubmit);
loadMoreBtn.addEventListener('click', onLoadMoreButtonClick);

async function onFormSubmit(event) {
  event.preventDefault();
  loadMoreBtn.classList.add('visually-hidden');
  clearGallery();
  params.q = event.target.searchQuery.value;
  params.page = 1;
  const galleryData = await getGallery();
  if (galleryData.totalHits === 0) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.',
    );
    event.target.searchQuery.value = '';
    return;
  }
  Notiflix.Notify.success(`Hooray! We found ${galleryData.totalHits} images.`);
  const markupArray = galleryData.hits.map(createMarkup);
  addMarkup(markupArray.join(''));
  gallerySimpleLightbox = new SimpleLightbox('.gallery a');
  loadMoreBtn.classList.remove('visually-hidden');
}

async function getGallery() {
  const result = await axios.get(`${BASE_URL}`, { params });
  params.page += 1;
  return result.data;
}

function createMarkup({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) {
  return `
   <div class="photo-card">
        <a href="${largeImageURL}"><img src="${webformatURL}" alt="${tags}" loading="lazy" /></a>
        <div class="info">
          <p class="info-item">
            <b>Likes</b> ${likes}
          </p>
          <p class="info-item">
            <b>Views</b> ${views}
          </p>
          <p class="info-item">
            <b>Comments</b> ${comments}
          </p>
          <p class="info-item">
            <b>Downloads</b> ${downloads}
          </p>
        </div>
    </div>
    `;
}

function addMarkup(markup) {
  gallery.insertAdjacentHTML('beforeend', markup);
}

function clearGallery() {
  gallery.innerHTML = '';
}

async function onLoadMoreButtonClick() {
  const galleryData = await getGallery();

  if (galleryData.hits.length === 0) {
    Notiflix.Notify.info(`We're sorry, but you've reached the end of search results.`);
    return;
  }

  const markupArray = galleryData.hits.map(createMarkup);
  addMarkup(markupArray.join(''));
  const { height: cardHeight } = gallery.firstElementChild.getBoundingClientRect();
  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
  gallerySimpleLightbox.refresh();
}
