const express = require("express");
const cors = require("cors");

const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories)
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    likes:0,
    title,
    url,
    techs,
  }

  repositories.push(repository);

  return response.json(repository)
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;
  
  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if(repositoryIndex < 0) {
    return response.status(400).json({error: 'Repository does not exist!'})
  }

  repositories[repositoryIndex] = {...repositories[repositoryIndex], title:title, url: url, techs: techs};  

  return response.status(200).json(repositories[repositoryIndex])
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if(repositoryIndex < 0) {
    return response.status(400).json({error: 'Repository does not exist!'});
  }

  repositories.splice(repositoryIndex,1)

  return response.status(204).json()
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;
  const repositoryIndex = repositories.findIndex(repository => repository.id === id);  

  if(repositoryIndex < 0) {
    return response.status(400).json({error: 'Repository does not exist!.'});
  }

  repositories[repositoryIndex].likes += 1;

  return response.status(200).json(repositories[repositoryIndex]);
});

module.exports = app;
