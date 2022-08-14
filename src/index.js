import { Notify } from "notiflix";
import NewApiService from "./fetchImage"
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const refs = {
    formEl: document.querySelector('#search-form'),
    galleryEl: document.querySelector('.gallery'),
    loadMoreBtn: document.querySelector('.load-more'),
};

const newApiService = new NewApiService();
const lightbox = new SimpleLightbox('.gallery a');

refs.formEl.addEventListener('submit', onSearch);
refs.loadMoreBtn.addEventListener('click', onLoadMore);
refs.loadMoreBtn.classList.toggle('is-hidden');

async function onSearch(event) {
    event.preventDefault();
    
    const { searchQuery } = event.currentTarget;
    const imageSearchName = searchQuery.value;

    clearListItems();
    refs.loadMoreBtn.classList.toggle('is-hidden');

    newApiService.query = imageSearchName;
    newApiService.resetPage();

    try {
        const items = await newApiService.fetchImage()
        return addedFirstItems(items);
    } catch (error) {
        console.log(error)
    }
}

function createListItems(items) {
    const articles = items.hits;
    const markup = articles
        .map(({largeImageURL, webformatURL, tags, likes, views, comments, downloads}) => {
            return `<div class="card-thumb"><div class="photo-card"><a href="${largeImageURL}"><img src="${webformatURL}" alt="${tags}" loading="lazy" width="360" height="240" /></a><div class="info"><p class="info-item"><b>Likes</b> <span>${likes}</span></p><p class="info-item"><b>Views</b> <span>${views}</span></p><p class="info-item"><b>Comments</b> <span>${comments}</span></p><p class="info-item"><b>Downloads</b> <span>${downloads}</span></p></div></div></div>`;
        })
        .join('');
    refs.galleryEl.insertAdjacentHTML('beforeend', markup);
    lightbox.refresh();
};

async function onLoadMore() {
    try {
        const items = await newApiService.fetchImage();
        return loadingNextItems(items);
    } catch (error) {
        console.log(error)
    }
}

function addedFirstItems(items) {
    Notify.success(`Hooray! We found ${items.totalHits} images.`);
            if (items.length === 0) {
                return Notify.failure("Sorry, there are no images matching your search query. Please try again.");
        };
        createListItems(items);
}

function loadingNextItems(items) {
    const limitPage = items.totalHits / newApiService.per_page;
        if (newApiService.page > limitPage) {
            refs.loadMoreBtn.classList.toggle('is-hidden');
            return Notify.failure("We're sorry, but you've reached the end of search results.")
        }
        createListItems(items);
        lightbox.refresh();
}

function clearListItems() {
    refs.galleryEl.innerHTML = "";
}