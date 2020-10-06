const Sequelize = require('sequelize');
const connection = require('../database');

const Resposta = connection.define('resposta',
  // nossos campos  
  {
    corpo: { // corpo é a resposta
      type: Sequelize.TEXT,
      allowNull: false,
    },

    // toda a resposta pertence a uma pergunta
    // ou seja, toda responta vai responder uma pergunta
    perguntaId: { // relacionamento "cru". Isso porque existe maneiras melhores para relacionamento
      type: Sequelize.INTEGER,
      allowNull: false,
    }
  }
)

Resposta.sync({ force: false }).then(() => { });

module.exports = Resposta;