const apiUrl = 'http://localhost:3000/movies';

document.addEventListener('DOMContentLoaded', () => {
  loadMovies();
  document.getElementById('addMovieForm').addEventListener('submit', addMovie);
});

function loadMovies() {
  fetch(apiUrl)
    .then((response) => response.json())
    .then((movies) => {
      const list = document.getElementById('list');
      list.innerHTML = '';
      movies.forEach((movie) => {
        const movieElem = document.createElement('li');
        movieElem.innerHTML = `
          <p>${movie.id}</p>
          <p>${movie.title}</p>
          <p>${movie.genre}</p>
          <p>${movie.director}</p>
          <p>${movie.year}</p>
          <ul>
            <button onclick="updateMovie('${movie.id}')">Оновити Назву</button>
            <button onclick="editMovie('${movie.id}')">Редагувати режисера</button>
            <button onclick="deleteMovie('${movie.id}')">Видалити</button>
          </ul>
        `;
        list.appendChild(movieElem);
      });
    })
    .catch((error) => console.error('Помилка завантаження фільмів:', error));
}

function addMovie(e) {
  e.preventDefault();
  const title = document.getElementById('title').value;
  const genre = document.getElementById('genre').value;
  const director = document.getElementById('director').value;
  const year = parseInt(document.getElementById('year').value, 10);

  if (!title || !genre || !director || !year) {
    alert('Будь ласка, заповніть усі поля.');
    return;
  }

  fetch(apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, genre, director, year }),
  })
    .then((response) => response.json())
    .then(() => {
      loadMovies();
      document.getElementById('addMovieForm').reset();
    })
    .catch((error) => console.log('Помилка додавання фільму:', error));
}

function deleteMovie(id) {
  fetch(`${apiUrl}/${id}`, { method: 'DELETE' })
    .then((response) => {
      return response.json();
    })
    .then(() => loadMovies())
    .catch((error) => console.log(error));
}

function updateMovie(id) {
  const newTitle = prompt('Введіть нову назву фільму:');
  if (!newTitle) return;

  fetch(`${apiUrl}/${id}`)
    .then((response) => {
      return response.json();
    })
    .then((movie) => {
      return fetch(`${apiUrl}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle,
          director: movie.director,
          genre: movie.genre,
          year: movie.year,
        }),
      });
    })
    .then(() => loadMovies())
    .catch((error) => console.error('Помилка оновлення фільму:', error));
}

function editMovie(id) {
  const newDirector = prompt('Введіть нового режисера:');
  if (!newDirector) return;

  fetch(`${apiUrl}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ director: newDirector }),
  })
    .then(() => loadMovies())
    .catch((error) => console.error('Помилка редагування фільму:', error));
}
