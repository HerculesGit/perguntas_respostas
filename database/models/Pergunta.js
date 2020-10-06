// uma boa pratica, já que é um model, é usar letra maiuscula no começo


const Sequelize = require('sequelize');
const connection = require('../database');

//  nosso model
const Pergunta = connection.define(
  // nome da tabela
  'pergunta',

  // campos
  {
    titulo: {
      type: Sequelize.STRING,
      allowNull: false
    },
    descricao: {
      type: Sequelize.TEXT,
      allowNull: false
    }

  });


// vai sincronizar o que temos acima com o banco, ou seja,
// se não houver tabela no banco ele vai criar, o force: false diz que se não vai forçar a criação se ela tiver sido criada 
Pergunta.sync({ force: false }).then(() => { });


module.exports = Pergunta;