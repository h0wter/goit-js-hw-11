import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import { params, getGallery } from './getGallery';
import { createMarkup, addMarkup, clearGallery } from './galleryOperations';
import onLoadMoreButtonClick from './onLoadMoreButtonClick';
import 'simplelightbox/dist/simple-lightbox.min.css';
import './css/styles.css';

const form = document.querySelector('.search-form');
const loadMoreBtn = document.querySelector('.load-more');

let gallerySimpleLightbox = null;
form.addEventListener('submit', onFormSubmit);
loadMoreBtn.addEventListener('click', onLoadMoreButtonClick);

async function onFormSubmit(event) {
  event.preventDefault();
  loadMoreBtn.classList.add('visually-hidden');
  clearGallery();
  params.q = event.target.searchQuery.value;
  if (!params.q) {
    Notiflix.Notify.failure('Please enter your request!');
    return;
  }
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

export { gallerySimpleLightbox };
