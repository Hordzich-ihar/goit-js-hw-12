import './css/styles.css';
import 'izitoast/dist/css/iziToast.min.css';
import 'loaders.css/loaders.min.css';

import iziToast from 'izitoast';

import { getImagesByQuery, PER_PAGE } from './js/pixabay-api';
import {
  createGallery,
  clearGallery,
  showLoader,
  hideLoader,
  showLoadMoreButton,
  hideLoadMoreButton,
} from './js/render-functions';

const formEl = document.querySelector('.form');
const loadMoreBtn = document.querySelector('.load-more');

let query = '';
let page = 1;

formEl.addEventListener('submit', onSearchSubmit);
loadMoreBtn.addEventListener('click', onLoadMore);

async function onSearchSubmit(event) {
  event.preventDefault();

  const newQuery = event.target.elements['search-text'].value.trim();

  if (!newQuery) {
    iziToast.error({
      message: 'Please enter a search query!',
      position: 'topRight',
    });
    return;
  }


  query = newQuery;
  page = 1;
  clearGallery();
  hideLoadMoreButton();
  await fetchAndRenderImages({ isLoadMore: false });
  formEl.reset();
}

async function onLoadMore() {

  hideLoadMoreButton();
  await fetchAndRenderImages({ isLoadMore: true });
}

async function fetchAndRenderImages({ isLoadMore }) {
  try {
    showLoader();

    const data = await getImagesByQuery(query, page);
    const { hits, totalHits } = data;

    if (!hits.length) {
      iziToast.error({
        message:
          'Sorry, there are no images matching your search query. Please try again!',
        position: 'topRight',
      });
      hideLoadMoreButton();
      return;
    }

    createGallery(hits);
    page += 1;

    const totalPages = Math.ceil(totalHits / PER_PAGE);
    if (page > totalPages) {
      hideLoadMoreButton();
      iziToast.info({
        message: "We're sorry, but you've reached the end of search results.",
        position: 'topRight',
      });
    } else {
      showLoadMoreButton();
    }

    if (isLoadMore) {
      smoothScroll();
    }
  } catch (error) {
    iziToast.error({
      message: 'Something went wrong. Please try again!',
      position: 'topRight',
    });
    hideLoadMoreButton();
  } finally {
    hideLoader();
  }
}

function smoothScroll() {
  const firstCard = document.querySelector('.gallery-item');
  if (!firstCard) return;

  const { height } = firstCard.getBoundingClientRect();
  window.scrollBy({
    top: height * 2,
    behavior: 'smooth',
  });
}
