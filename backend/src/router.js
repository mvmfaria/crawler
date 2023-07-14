const express = require('express');

const crawl = require('./crawler');

const router = express.Router();

//Essa rota será responsável para retornar para a tabela o resultado do crawler.
router.get('/tasks', async (req, res) => {

    try {
      const result = await crawl("https://en.wikipedia.org/wiki/List_of_dog_breeds", 10);
      res.setHeader('Content-Type', 'application/json');
      res.send(result);

    } catch (error) {
      console.error(error);
      res.status(500).send('Ocorreu um erro ao executar o crawler.');
    }
  });

module.exports = router;