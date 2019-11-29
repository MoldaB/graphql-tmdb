const fetch = require('node-fetch')

const person = fetch(
  `https://api.themoviedb.org/3/person/1245?api_key=8bbb74b042813540851f8226925ac962`
).then(response => response.json())

const personsMovies = fetch(
  `https://api.themoviedb.org/3/person/1245/movie_credits?api_key=8bbb74b042813540851f8226925ac962`
).then(response => response.json())

const result = await Promise.all([person, personsMovies])
.then(responses => {
  const [personData, moviesData] = responses
  personData.movies = moviesData.cast
  return personData
})

const movies = result.movies
movies