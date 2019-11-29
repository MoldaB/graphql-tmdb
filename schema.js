const fetch = require('node-fetch')
const { GraphQLSchema, GraphQLObjectType, GraphQLInt, GraphQLString, GraphQLList } = require('graphql')

const MovieType = new GraphQLObjectType({
  name: 'Movie',
  description: '...',

  fields: () => ({
    title: {
      type: GraphQLString,
      resolve: json => json.title
    },
    releaseDate: {
      type: GraphQLString,
      resolve: json => json.release_date
    }
  })
})

const PersonType = new GraphQLObjectType({
  name: 'Person',
  description: '...',

  fields: () => ({
    name: {
      type: GraphQLString,
      resolve: json => json.name
    },
    movies: {
      type: GraphQLList(MovieType),
      resolve: json => json.movies
    }
  })
})

module.exports = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    description: '...',
    fields: () => ({
      person: {
        type: PersonType,
        args: {
          id: { type: GraphQLInt }
        },
        resolve: async (root, args) => {
          const person = fetch(
            `https://api.themoviedb.org/3/person/${args.id}?api_key=8bbb74b042813540851f8226925ac962`
          ).then(response => response.json())
          const personsMovies = fetch(
            `https://api.themoviedb.org/3/person/${args.id}/movie_credits?api_key=8bbb74b042813540851f8226925ac962`
          ).then(response => response.json())
          return await Promise.all([person, personsMovies]).then(responses => {
            const [personData, moviesData] = responses
            personData.movies = moviesData.cast
            return personData
          })
        }
      }
    })
  })
})