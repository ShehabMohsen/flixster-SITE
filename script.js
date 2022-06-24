// movies currently playing URL = https://api.themoviedb.org/3/movie/now_playing?api_key=<<api_key>>&language=en-US&page=1
//search URL = https://api.themoviedb.org/3/search/movie?api_key=<<api_key>>&query=${search_value}q&language=en-US&page=1&include_adult=false
// Query selector stuff:
const moviesAREA = document.querySelector("#movies-grid");
const SUBMISSION = document.querySelector("#search-input");
const BTN = document.querySelector("#submit-btn");
const CURRENT_BTN = document.querySelector("#close-search-btn");
const MORE_BTN = document.querySelector("#load-more-movies-btn");

// API key and URLs
const API_KEY = "e317087c698363ab6080989433dc3835";
const URL = `https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}&language=en-US&page=1`;
const IMG_PREFIX = "https://image.tmdb.org/t/p/w300/";
var page = 1;

// fetching data and displaying movies:

async function getMovies(url) {
  page = 1;
  let response = await fetch(url);
  let responseData = await response.json();
  console.log("responseData:", responseData);
  displayMovies(responseData);
}

async function getMoreMovies(url) {
  let response = await fetch(url);
  let responseData = await response.json();
  console.log("more responseData:", responseData);

  let dataArray = responseData.results;
  dataArray.forEach((element) => {
    if (element.poster_path != null) {
      console.log(element.original_title, element.id);
      moviesAREA.innerHTML += `<div class = "movie-card">
                <img src = "${
                  IMG_PREFIX + element.poster_path
                }" class = "movie-image" alt = "movie image"/>
                <div class = "movie-info">
                    <h3 class = "movie-title"> ${element.original_title} </h3>
                    <p class = "movie-rating"> ${element.vote_average}/10 </p>
                    <button class="btn" id="learn-more"> learn more </button>  
                </div>
                
            </div>`;
    }
  });
}

function getCurrentMovies() {
  getMovies(URL);
}

async function displayMovies(responseData) {
  let dataArray = responseData.results;
  moviesAREA.innerHTML = ``;

  for (let i = 0; i < dataArray.length; i++) {
    if (dataArray[i].backdrop_path != null) {
      // getting extra data such as overview, release date, etc
      let moreData = await fetch(
        `https://api.themoviedb.org/3/movie/${dataArray[i].id}?api_key=${API_KEY}&language=en-US`
      );
      let MoreDataObject = await moreData.json();
      detailsObj = getDetailsObj(MoreDataObject);
      // console.log(dataArray[i].original_title, detailsObj)
      // console.log(detailsObj.genres);
      moviesAREA.innerHTML += `
            <div class = "movie-card">
                <img src = "${
                  IMG_PREFIX + dataArray[i].poster_path
                }" class = "movie-poster" alt = "movie image"/>
                <div class = "movie-info">
                    <h3 class = "movie-title"> ${
                      dataArray[i].original_title
                    } </h3>
                    <p class = "movie-votes"> ${
                      dataArray[i].vote_average
                    }/10 </p>
                    
                    <!--modal start-->

                    <button class = "open-modal"  id="learn-more${i}" data-index = "${i}">learn more</button>
                    <div class = "modal" id = "simple-modal${i}">
                        <div class = "modal-content" id = "modal-content${i} data-index = ${i}">
                            <h2 class="modal-header">
                            ${
                              dataArray[i].original_title
                            }<span class="close-btn" id="close${i}" data-index = "${i}">&times;</span>
                            </h2>
                            <p> Release date: ${detailsObj.release_date} <p>
                            <p> Genres: ${getGenres(detailsObj.genres)} <p> 
                            <p> Overview: ${detailsObj.overview} <p>
                        </div>
                    </div>

                    <!--modal end-->
                </div>
            </div>
            `;
    }
  }

  function getGenres(array) {
    let sentence = "";

    for (let i = 0; i < array.length; i++) {
      sentence += array[i].name;
      if (i < array.length - 1) sentence += ", ";
    }
    console.log("sentence", sentence);
    return sentence;
  }
}

// get more details regarding a movie
function getDetailsObj(responseData) {
  // console.log(responseData);
  detailsObj = {
    genres: responseData.genres,
    overview: responseData.overview,
    release_date: responseData.release_date,
    backdrop_path: responseData.backdrop_path,
  };
  return detailsObj;
}

// event listeners
BTN.addEventListener("click", (evt) => {
  evt.preventDefault();
  console.log("submission value:", SUBMISSION.value);
  let url = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${SUBMISSION.value}&language=en-US&page=1&include_adult=false`;
  getMovies(url);
}); 

CURRENT_BTN.addEventListener("click", (evt) => {
  evt.preventDefault();
  SUBMISSION.value = "";
  getCurrentMovies();
});

MORE_BTN.addEventListener("click", (evt) => {
  page += 1;
  if (SUBMISSION.value == "") {
    let url = `https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}&language=en-US&page=${page}`;
    getMoreMovies(url);
  } else {
    let url = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${SUBMISSION.value}&language=en-US&page=${page}&include_adult=false`;
    getMoreMovies(url);
  }
});

// Scrolling Back To TOp
//Get the button:
const SCROLL_BTN = document.getElementById("scroll_up");

// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function () {
  scrollFunction();
};

function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    SCROLL_BTN.style.display = "block";
  } else SCROLL_BTN.style.display = "none";
}
SCROLL_BTN.addEventListener("click", topFunction);

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}

// OPEN MODAL
let open_btn = document.querySelector("body");
open_btn.addEventListener("click", openModal);
function openModal(event) {
  if (event.target.classList.contains("open-modal")) {
    let i = event.target.dataset.index;
    document.querySelector(`#simple-modal${i}`).style.display = "flex";
  }
}

// Close Modal
let close_btn = document.querySelector("body");
close_btn.addEventListener("click", closeModal);
function closeModal(event) {
  if (event.target.classList.contains("close-btn")) {
    let i = event.target.dataset.index;
    document.querySelector(`#simple-modal${i}`).style.display = "none";
  }
}

const modalContent = document.querySelector("modal-content")
window.addEventListener('click', (event)=>{
  if (event.target.classList.contains("modal")){
    console.log("button clicked")
    let i = event.target.dataset.index;
    document.querySelector(`#simple-modal${i}`).style.display = "none";
  }
});


// as soon as the window loads:
window.onload = function () {
  getCurrentMovies();
};
