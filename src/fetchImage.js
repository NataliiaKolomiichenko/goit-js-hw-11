import axios from "axios";

export default class NewApiService {
    constructor() {
        this.searchQuery = '';
        this.page = 1;
        this.per_page = 40;
    }

    async fetchImage() {
    const BASE_URL = 'https://pixabay.com/api/';

    const params = {
        key: "29219900-e72d79efdd6d7521174d51810",
        q: this.searchQuery,
        image_type: "photo",
        orientation: "horizontal",
        safesearch: true,
    };

        const { key, q, image_type, orientation, safesearch } = params;
        const url = `${BASE_URL}?key=${key}&q=${q}&image_type=${image_type}&orientation=${orientation}&safesearch=${safesearch}&page=${this.page}&per_page=${this.per_page}`

        try {
            const response = await axios.get(url);
            const dataItems = await this.getDataItems(response.data);
            return dataItems;
        } catch (error) {
            console.log(error)
        }
    }
        
    getDataItems(response) {
        this.increasePage();
        const items = response;
        return items;
    }

    increasePage() {
        this.page += 1;
    }

    get query() {
        return this.searchQuery
    }

    set query(newQuery) {
        this.searchQuery = newQuery;
    }

    resetPage() {
        this.page = 1;
    }

    }