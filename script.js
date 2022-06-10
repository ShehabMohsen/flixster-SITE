

// movies currently playing URL = https://api.themoviedb.org/3/movie/now_playing?api_key=<<api_key>>&language=en-US&page=1
//search URL = https://api.themoviedb.org/3/search/movie?api_key=<<api_key>>&query=${search_value}q&language=en-US&page=1&include_adult=false
// Query selector stuff:
const moviesAREA = document.querySelector("#movies-area");
const SUBMISSION = document.querySelector("#movie-input");
const BTN = document.querySelector("#submit-btn");
const CURRENT_BTN = document.querySelector("#current-btn");
const MORE_BTN = document.querySelector("#more-btn")





// API key and URLs
const API_KEY = "e317087c698363ab6080989433dc3835";
const URL =  `https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}&language=en-US&page=1`;
const IMG_PREFIX = "https://image.tmdb.org/t/p/w300/"

var page = 1;

// fetching data and displaying movies:

async function getMovies(url){
    page = 1;
    let response = await fetch(url);
    let responseData = await response.json();
    console.log("responseData:", responseData)
    displayMovies(responseData);

}

async function getMoreMovies(url){
    let response = await fetch(url);
    let responseData = await response.json();
    console.log("more responseData:", responseData)

    let dataArray = responseData.results
    dataArray.forEach(element => {    
        if (element.backdrop_path !=null){
            moviesAREA.innerHTML += 
            `<div class = "movie-poster">
                <img src = "${IMG_PREFIX + element.poster_path}" class = "movie-image" alt = "movie image"/>
                <div class = "movie-info">
                    <h3 class = "movie-title"> ${element.original_title} </h3>
                    <p class = "movie-rating"> ${element.vote_average}/10 </p>
                    <button class="btn" id="learn-more"> learn more </button>  
                </div>
            </div>`
        } 
    });
}

function getCurrentMovies(){
    getMovies(URL);
}

function displayMovies(responseData){
    let dataArray = responseData.results
    moviesAREA.innerHTML = ``;
    dataArray.forEach(element => {    
        if (element.backdrop_path !=null){
            moviesAREA.innerHTML += 
            `<div class = "movie-poster">
                <img src = "${IMG_PREFIX + element.poster_path}" class = "movie-image" alt = "movie image"/>
                <div class = "movie-info">
                    <h3 class = "movie-title"> ${element.original_title} </h3>
                    <p class = "movie-rating"> ${element.vote_average}/10 </p>

                    <button id="learn-more"> learn more modal </button>
                </div>
            </div>
            `
        } 
    });
}

// event listeners
BTN.addEventListener("click", (evt)=>{
    evt.preventDefault();
    console.log("submission value:", SUBMISSION.value);
    let url = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${SUBMISSION.value}&language=en-US&page=1&include_adult=false`;
    getMovies(url);
})

CURRENT_BTN.addEventListener("click", (evt)=>{
    evt.preventDefault();
    SUBMISSION.value= ''
    getCurrentMovies();
})


MORE_BTN.addEventListener("click", (evt)=>{
    page += 1
    if (SUBMISSION.value == '') {
        let url = `https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}&language=en-US&page=${page}`;
        getMoreMovies(url);
    }
    else {
        let url = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${SUBMISSION.value}&language=en-US&page=${page}&include_adult=false`;
        getMoreMovies(url);
    }
})



window.onload = function(){
    getCurrentMovies()
}