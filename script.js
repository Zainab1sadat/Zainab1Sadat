const API_KEY ="38995506d4be5157b8257066ab86322a";
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
            <div class="rating-section">
                <label for="rating">Rate:</label>
                <div class="star-rating" data-movie-id="${movie.id}">
                    <span data-value="1">&#9733;</span>
                    <span data-value="2">&#9733;</span>
                    <span data-value="3">&#9733;</span>
                    <span data-value="4">&#9733;</span>
                    <span data-value="5">&#9733;</span>
                </div>
                <textarea class="comment" data-movie-id="${movie.id}" placeholder="Add your comment..."></textarea>
                <button class="submit-comment" data-movie-id="${movie.id}">Submit</button>
            </div>
            <div class="comments-section">
                <h4>Comments:</h4>
                <ul class="comments-list" data-movie-id="${movie.id}"></ul>
            </div>
        `;

        leftSection.appendChild(movieCard);
    });

    initializeStarRatings();
    addCommentListeners();
}

// Function to fetch popular movies
async function fetchMovies() {
    try {
        const response = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}`);
        if (!response.ok) throw new Error('Failed to fetch movies');

        const data = await response.json();
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
            <div class="rating-section">
                <label for="rating">Rate:</label>
                <div class="star-rating" data-movie-id="${movie.id}">
                    <span data-value="1">&#9733;</span>
                    <span data-value="2">&#9733;</span>
                    <span data-value="3">&#9733;</span>
                    <span data-value="4">&#9733;</span>
                    <span data-value="5">&#9733;</span>
                </div>
                <textarea class="comment" data-movie-id="${movie.id}" placeholder="Add your comment..."></textarea>
                <button class="submit-comment" data-movie-id="${movie.id}">Submit</button>
            </div>
            <div class="comments-section">
                <h4>Comments:</h4>
                <ul class="comments-list" data-movie-id="${movie.id}"></ul>
            </div>
        `;

        rightSection.appendChild(movieItem);
    });

    initializeStarRatings();
    addCommentListeners();
}

// Add event listeners for comments and ratings
function addCommentListeners() {
    const submitButtons = document.querySelectorAll('.submit-comment');
    submitButtons.forEach(button => {
        button.addEventListener('click', () => {
            const movieId = button.getAttribute('data-movie-id');
            const starRatingElement = document.querySelector(`.star-rating[data-movie-id="${movieId}"]`);
            const rating = starRatingElement.dataset.selectedValue || 0;
            const commentInput = document.querySelector(`.comment[data-movie-id="${movieId}"]`);
            const comment = commentInput.value;

            if (comment.trim() === "") {
                alert("Comment cannot be empty!");
                return;
            }

            saveComment(movieId, rating, comment);
            displayComments(movieId);

            // Clear the input field after submission
            commentInput.value = '';
        });
    });
}

// Save comment to localStorage
function saveComment(movieId, rating, comment) {
    const comments = JSON.parse(localStorage.getItem('comments')) || {};

    if (!comments[movieId]) {
        comments[movieId] = [];
    }

    comments[movieId].push({ rating, comment });
    localStorage.setItem('comments', JSON.stringify(comments));
}

// Display comments for a specific movie
function displayComments(movieId) {
    const commentsList = document.querySelector(`.comments-list[data-movie-id="${movieId}"]`);
    const comments = JSON.parse(localStorage.getItem('comments')) || {};

    commentsList.innerHTML = ''; // Clear existing comments to avoid duplicates

    if (comments[movieId]) {
        comments[movieId].forEach(entry => {
            const listItem = document.createElement('li');
            listItem.textContent = `Rating: ${entry.rating}, Comment: ${entry.comment}`;
            commentsList.appendChild(listItem);
        });
    }
}

// Initialize star ratings
function initializeStarRatings() {
    const starRatings = document.querySelectorAll('.star-rating');

    starRatings.forEach(starRating => {
        const stars = starRating.querySelectorAll('span');
        stars.forEach(star => {
            // Hover effect
            star.addEventListener('mouseover', () => {
                const value = parseInt(star.dataset.value);
                highlightStars(stars, value);
            });

            // Remove hover effect
            star.addEventListener('mouseout', () => {
                clearHighlight(stars);
                const selectedValue = starRating.dataset.selectedValue;
                if (selectedValue) highlightStars(stars, parseInt(selectedValue));
            });

            // Click to select a rating
            star.addEventListener('click', () => {
                const value = parseInt(star.dataset.value);
                starRating.dataset.selectedValue = value;
                highlightStars(stars, value);
            });
        });
    });
}

function highlightStars(stars, value) {
    stars.forEach(star => {
        const starValue = parseInt(star.dataset.value);
        if (starValue <= value) {
            star.classList.add('selected');
        } else {
            star.classList.remove('selected');
        }
    });
}

function clearHighlight(stars) {
    stars.forEach(star => star.classList.remove('selected'));
}

// Fetch movies when the page loads
document.addEventListener('DOMContentLoaded', () => {
    fetchMovies();
    fetchBestMovies();
    const savedComments = JSON.parse(localStorage.getItem('comments')) || {};
    Object.keys(savedComments).forEach(movieId => displayComments(movieId));
});
