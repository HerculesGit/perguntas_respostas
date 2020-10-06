const express = require("express") // importando
const app = express() // copia do express para a variavel

// Aula 37 - falando sobre body parse. No caso, serve para pegar os dados que foram enviados pelo formulário
// Ele traduz os dados enviados no formulário e traduz em JS
const bodyParser = require('body-parser');

// conexao com o banco de dados
const connection = require('./database/database');

// tentando autenticar 
connection.authenticate()
  .then(() => {
    console.log('Conexão feita com o banco de dados')
  }).catch((msgError) => console.log(msgError));


// só por está aqui importado, quando chegar nesta linha
// o código que está no model será executado 
const PerguntaModel = require('./database/models/Pergunta');

const RespostaModel = require('./database/models/Resposta');


/* temos que ter uma pasta /views com arquivos com a extensão .ejs */
// configurar o ejs com o express
// estamos dizendo ao express qual o motor de enginer queremos usar;
// No caso, para desenhar o html
app.set('view engine', 'ejs');

// Fazendo o express aceitar css, jpg, png (arquivos de images)...
// ou seja, para o express aceitar arquivos estáticos
app.use(express.static('public')) // por convensao, é chamda de  public

// Fazer o express usar o body-parser // aqui é onde ele decodifica os dados do form para entendermos em js 
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json()); // Permite que leiamos dados enviados via JSON - muito útil quando utilizamos API's

app.get("/", (req, res) => {

  // SELECT * FROM pergunta;
  // se usar apenas findAll() ele traz mais informacoes que os dados como o model
  PerguntaModel.findAll({
    raw: true,
    order: [['id', 'DESC']] // primeiro é o campo, o segundo é o qual DESC ou ASC
  })
    .then(perguntas => {
      res.render('index', {
        perguntas: perguntas
      })
    });

  // // a resposta vamos mandar renderizar o arquivo
  // res.render("index",
  //   {}) // lembrando que ele tá indo na pasta /views que é a padrão
})

app.get('/perguntar', (req, res) => {

  res.render("perguntar", {})
  // nao usa o res.send(""); quando utiliza-se o render
})

// Essa será a rota que o <form></form> do ejs irá mandar os dados para salvar 
app.post('/salvarpergunta', (req, res) => {
  // o body-parser disponibilizou o objeto ```body```

  let titulo = req.body.titulo; // lembrando que esse .titulo é o que colocamos no <input name="titulo"/>  no html 
  let descricao = req.body.descricao;


  // equivalente a INSERT INTO perguntas...
  PerguntaModel.create({
    titulo: titulo,
    descricao: descricao
  }).then(() => {

    // redirecionamento de variavel quando for salvo no database
    res.redirect('/');

  });

  // res.send(`Formulário recebido titulo=${titulo}, descricao=${descricao}`)

});


app.get('/pergunta/:id', (req, res) => {
  const id = req.params.id;
  PerguntaModel.findOne({
    // uma pergunta onde tem o id == id passado;
    // no where podemos pesquisar por qualquer campo da tabela
    where: { id: id }
  }).then((pergunta) => {

    if (pergunta) {
      // pesquisar todas as respostas dessa pergunta
      RespostaModel.findAll({
        where: {
          perguntaId: id
        },
        order: [['id', 'DESC']]
      }).then((respostas) => {
        res.render('pergunta', {
          pergunta: pergunta,
          respostas: respostas
        });
      })


    } else {
      res.redirect('/');
    }

  });

})


// Post porque vai receber os dados do form
app.post('/responder', (req, res) => {

  // lembrando que body.corpo funciona pq no form temos name="corpo"
  const corpo = req.body.corpo;
  const perguntaId = req.body.perguntaId;

  RespostaModel.create({
    corpo: corpo,
    perguntaId: perguntaId
  }).then(() => {
    res.redirect(`/pergunta/${perguntaId}`)
  });

})

app.listen(3000, (error) => console.log("App rodando"))
