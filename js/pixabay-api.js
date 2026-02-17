import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '54645624-93bc72701cdff138f1edf2876';
const PER_PAGE = 15;

export async function getImagesByQuery(query, page = 1) {
  const q = query.trim();

  const { data } = await axios.get(BASE_URL, {
    params: {
      key: API_KEY,
      q,
      page,
      per_page: PER_PAGE,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
    },
  });

  return data;
}

export { PER_PAGE };
