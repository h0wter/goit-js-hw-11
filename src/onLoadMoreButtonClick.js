import { getGallery } from './getGallery';
import { gallery, createMarkup, addMarkup, clearGallery } from './galleryOperations';
import { gallerySimpleLightbox } from './index';

export default async function onLoadMoreButtonClick() {
  const galleryData = await getGallery();

  if (galleryData.hits.length === 0) {
    Notiflix.Notify.info(`We're sorry, but you've reached the end of search results.`);
    loadMoreBtn.classList.add('visually-hidden');
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
