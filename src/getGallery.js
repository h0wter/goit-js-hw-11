import axios from 'axios';
const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '27001286-6f78b2bfddf63080b94e291b1';
const params = {
  key: API_KEY,
  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: true,
  page: 1,
  per_page: 40,
};

async function getGallery() {
  const result = await axios.get(`${BASE_URL}`, { params });
  params.page += 1;
  return result.data;
}

export { params, getGallery };
