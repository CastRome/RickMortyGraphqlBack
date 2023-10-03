const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const axios = require('axios');
const cors = require('cors');

async function startServer() {
  const app = express();

  app.use(cors());

  const typeDefs = gql`
    type Character {
      id: ID!
      name: String
      status: String
      image: String
      species: String
      gender: String
    }

    type PageInfo {
      count: Int
      pages: Int
      next: String
      prev: String
    }

    type CharacterResponse {
      info: PageInfo
      results: [Character]
    }

    type Query {
      characters(page: Int): CharacterResponse
    }
  `;

  const resolvers = {
    Query: {
      characters: async (_, { page = 1 }) => {
        try {
          const response = await axios.get(`https://rickandmortyapi.com/api/character/?page=${page}`);
          return response.data;
        } catch (error) {
          throw new Error(`Error al obtener los personajes: ${error.message}`);
        }
      },
    },
  };

  const server = new ApolloServer({ typeDefs, resolvers });

  await server.start();

  server.applyMiddleware({ app });

  const PORT = 4000;

  app.listen(PORT, () => {
    console.log(`Servidor GraphQL en http://localhost:${PORT}${server.graphqlPath}`);
  });
}

startServer();
