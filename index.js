const apiUrl = 'http://localhost:3000/movies';

document.addEventListener('DOMContentLoaded', () => {
  loadMovies();
  document.getElementById('addMovieForm').addEventListener('submit', addMovie);
});

async function loadMovies() {
  try {
    const response = await fetch(apiUrl);
    const movies = await response.json();
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
  } catch (error) {
    console.error('Помилка завантаження фільмів:', error);
  }
}

async function addMovie(e) {
  e.preventDefault();
  const title = document.getElementById('title').value;
  const genre = document.getElementById('genre').value;
  const director = document.getElementById('director').value;
  const year = parseInt(document.getElementById('year').value, 10);

  if (!title || !genre || !director || !year) {
    alert('Будь ласка, заповніть усі поля.');
    return;
  }

  try {
    await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, genre, director, year }),
    });
    loadMovies();
    document.getElementById('addMovieForm').reset();
  } catch (error) {
    console.error('Помилка додавання фільму:', error);
  }
}

async function deleteMovie(id) {
  try {
    await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
    loadMovies();
  } catch (error) {
    console.error('Помилка видалення фільму:', error);
  }
}

async function updateMovie(id) {
  const newTitle = prompt('Введіть нову назву фільму:');
  if (!newTitle) return;

  try {
    const response = await fetch(`${apiUrl}/${id}`);
    const movie = await response.json();

    await fetch(`${apiUrl}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: newTitle,
        director: movie.director,
        genre: movie.genre,
        year: movie.year,
      }),
    });
    loadMovies();
  } catch (error) {
    console.error('Помилка оновлення фільму:', error);
  }
}

async function editMovie(id) {
  const newDirector = prompt('Введіть нового режисера:');
  if (!newDirector) return;

  try {
    await fetch(`${apiUrl}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ director: newDirector }),
    });
    loadMovies();
  } catch (error) {
    console.error('Помилка редагування фільму:', error);
  }
}
