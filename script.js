const API_KEY ="38995506d4be5157b8257066ab86322a"
const BASE_URL = 'https://api.themoviedb.org/3';


// Fetch movies for the left section (Best Movies)
async function fetchBestMovies() {
    try {
        const response = await fetch(`${BASE_URL}/movie/top_rated?api_key=${API_KEY}`);
        if (!response.ok) throw new Error('Failed to fetch best movies');

        const data = await response.json();
        displayBestMovies(data.results);
    } catch (error) {
        console.error('Error fetching best movies:', error);
        alert('Could not load best movies. Please try again later.');
    }
}

// Display movies in the left section
function displayBestMovies(movies) {
    const leftSection = document.querySelector('.left-section');
    leftSection.innerHTML = ''; // Clear existing content

    movies.slice(0, 3).forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.classList.add('movie-card');

        movieCard.innerHTML = `
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
            <div class="movie-title">${movie.title}</div>
        `;

        leftSection.appendChild(movieCard);
    });
}


// Function to fetch popular movies
async function fetchMovies() {
    try {
        // Make API call to fetch popular movies
        const response = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}`);
        if (!response.ok) throw new Error('Failed to fetch movies');

        const data = await response.json();

        // Display the first 6 movies in the right section
        displayMoreMovies(data.results.slice(0, 6)); // Limit to 6 movies
    } catch (error) {
        console.error('Error fetching movies:', error);
        alert('Could not load movies. Please try again.');
    }
}

// Function to update the right section with movies
function displayMoreMovies(movies) {
    const rightSection = document.querySelector('.more-movie-list');
    rightSection.innerHTML = ''; // Clear existing content

    movies.forEach(movie => {
        const movieItem = document.createElement('div');
        movieItem.classList.add('more-movie-item');

        movieItem.innerHTML = `
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
            <div>${movie.title}</div>
        `;

        rightSection.appendChild(movieItem);
    });
}

// Fetch movies when the page loads
document.addEventListener('DOMContentLoaded', fetchMovies);
// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    fetchBestMovies(); // Load best movies for the left section
});
