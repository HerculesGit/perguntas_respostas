// Atraves do sequilize podemos manipular o banco de dados
// sem a necessidadde de código sql, apenas js

// nosso módulo de banco de dados: conexão e tals 

const Sequelize = require("sequelize");

const connection = new Sequelize('guiaperguntas', 'postgres', 'postgres',
  {
    host: 'localhost', // 
    dialect: 'postgres' // qual o tipo de banco
  })


// lembrando que para poder usar em outro arquivo é só fazer o export
module.exports = connection;
