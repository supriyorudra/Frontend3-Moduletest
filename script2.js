const search = document.querySelector('.search');
const cardContainer = document.querySelector('.container')
const inputBtn = document.querySelector('.input-btn');
const bookResults = document.querySelector('.bookResults');

let bookCards = [];
document.querySelectorAll('.card') ? bookCards = document.querySelectorAll('.card') : bookCards = [];
const bookResultsShow = document.querySelector('.bookResults');

let searchHistory = [];
localStorage.getItem('searchHistory') ? searchHistory = JSON.parse(localStorage.getItem('searchHistory')) : searchHistory = [];

inputBtn.addEventListener('click', (e) => {
    e.preventDefault();

    bookResults.innerHTML = search.value;

    let myArr = search.value.split(' ');
    let newSearch = myArr.join('+')

    let searchHistory = [];
    localStorage.getItem('searchHistory') ? searchHistory = JSON.parse(localStorage.getItem('searchHistory')) : searchHistory = [];

    const date = new Date();
    const searchHistoryNow = {
        date: date.toLocaleDateString(),
        time: date.toLocaleTimeString(),
        search: search.value,
    }
    searchHistory.push(searchHistoryNow);
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));

    if (search.value != "") {
        cardContainer.classList.remove('hide');
        async function fetchingData() {
            const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${newSearch}`);
            const data = await response.json();
            let bookStore = [];

            const dataItems = data.items;
            dataItems.map(arrItems => {
                const bookInfo = arrItems.volumeInfo;
                const books = {
                    id: arrItems.id,
                    image: bookInfo.imageLinks.thumbnail,
                    title: bookInfo.title,
                    author: bookInfo.authors[0],
                    pageCount: bookInfo.pageCount,
                    publisher: bookInfo.publisher
                }

                if (bookStore.length < dataItems.length) {
                    bookStore.push(books);
                }
                localStorage.setItem('bookStore', JSON.stringify(bookStore));
            })

            const cardWrapper = document.querySelector('.card-wrapper');
            JSON.parse(localStorage.getItem('bookStore')) ?
                JSON.parse(localStorage.getItem('bookStore')) : bookStore = [];
            cardWrapper.innerHTML = "";
            bookStore.map(item => {
                cardWrapper.innerHTML += `
                <div class="card">
                    <img class="image-top" src=${item.image} alt="${item.name}">
                    <div class="card-body">
                        <h5 class="card-title">${item.title}</h5>
                        <p class="card-author">Author: ${item.author}</p>
                        <p class="card-page-count">Page Count: ${item.pageCount}</p>
                        <p class="card-publisher">Publisher: ${item.publisher}</p>
                    </div>
                    <div class="btn">
                        <button class="buy-now">Buy Now</button>
                    </div>
                </div>
                `
            })
        }
        fetchingData();

    }
    else {
        cardContainer.classList.add('hide');
    }
})
