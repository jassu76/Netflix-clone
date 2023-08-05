

const apikey = "41a8fa1456e7f6cc6eaf531f4cd87fd9";
const apiEndpoint = "https://api.themoviedb.org/3";
const imgPath = "https://image.tmdb.org/t/p/original";
const apipaths = {
    fetchAllcategories: `${apiEndpoint}/genre/movie/list?api_key=${apikey}`,
    fetchMoviesList: (id) => `${apiEndpoint}/discover/movie?api_key=${apikey}&with_genres=${id}`,
    fetchTrending:`${apiEndpoint}/trending/all/day?api_key=${apikey}&language=en-US`,
      searchOnYoutube: (query) => `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&key=AIzaSyAInX13CgM4EKC0yJvmBSZYMQriTD2S_f0`,
     //searchOnYoutube: (videoId) =>`https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=AIzaSyAZroKqnMJVQYbqV5r8OKk-DpxibfzzYqw&part=snippet,contentDetails,statistics,status`
   
}




// boots up the aap
function init() {
   
    fetchtreadingmovie()
    fetchandbulidallsections();
}


function fetchtreadingmovie(){
    fetchandbulidsections(apipaths.fetchTrending, 'Treading Now')
    .then(list =>{
         const listRandom = parseInt(Math.random()*list.length);
        buildbannersection(list[listRandom]);
    });
}


function buildbannersection(Movies){
    const bannercout = document.getElementById('banner-section');
    bannercout.style.backgroundImage = `url('${imgPath}${Movies.backdrop_path}')`;

     const div = document.createElement('div');

   div.innerHTML= `  <h2 class="banner-title">${Movies.title}</h2>
   <p class="banner-info">Treading Movie| Release Date -  ${Movies.release_date}</p>
   <p class="banner-overview">${Movies.overview}</p>
   <div class="action-buttons-cont">
       <button class="action-button">Play</button>
       <button class="action-button">More Info</button>
   </div>`
  
     
  
      
       


   div.className = "banner-content container";

    bannercout.append(div);
}

function fetchandbulidallsections() {
    fetch(apipaths.fetchAllcategories)
    .then(res => res.json())
    .then(res => {
        const categories = res.genres;
        if (Array.isArray(categories) && categories.length) {
            categories.forEach(category => {
                fetchandbulidsections(
                    apipaths.fetchMoviesList(category.id),
                     category.name);
            });

        }
        // console.table(category);
    }).catch(error => {
        console.log(error);
    })
}

function fetchandbulidsections(fetchUrl, categoryName) {
    console.log(fetchUrl, categoryName);
     return fetch(fetchUrl)
        .then(res=> res.json())
        .then(res=>{
            // console.table(res.results)
            const Movies = res.results;
            if(Array.isArray(Movies) && Movies.length){
                buildMoviesSection(Movies, categoryName);
            }
            return Movies;
        })
        .catch(error => console.log(error));

}

function buildMoviesSection(List, categoryName){
    console.log(List, categoryName);

    const moviesCont = document.getElementById('Movies-cont');
     const moviesList = List.map(item => {
        return`
        <div class="Movies-item-img" onClick="searchOnYoutube('${item.title}')" >
        <img  class="Movies-item" src= "${imgPath}${item.backdrop_path}"alt="${item.title}"  >
         <iframe width="245px" height="150px" src="" id="yt${item.id}"></iframe>
       </div>`;
    }).join(' ');

    const moviesSectionHtml =`
    <h2 class="movie-secction.heading" style="color:white">${categoryName}<span class="explore-nudge">Explore All</span></h2>
     <div class="Movies-row">
       ${moviesList}
     </div>

    `
    // console.log(moviesSectionHtml);

    const div = document.createElement('div');
    div.className="Movies-section"
    div.innerHTML = moviesSectionHtml;
      





    // append html into movies container
     moviesCont.append(div);

}
console.log("youtube");

function searchOnYoutube(MoviesName, iframeId){
    // document.getElementById('iframeId')
     if(!MoviesName) return;

    fetch(apipaths.searchOnYoutube(MoviesName))
    .then(res=> res.json())
    .then(res=>{
        // console.log(res.items[0])
        const bestresult = res.items[1]
        const youtbeurl = `https://www.youtube.com/watch?v=${bestresult.id.videoId}`;
        console.log(youtbeurl);
        window.open(youtbeurl,'blank');
        // document.getElementById('iframeId').src=`https://www.youtube.com/embed/${bestresult.id.videoId}?autoplay=1&contorls=0`;

    }).catch(error=>console.log(error))
}









window.addEventListener('load', function () {
    init();
})



