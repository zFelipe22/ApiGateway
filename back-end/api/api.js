import express, { json } from 'express'
import cors from 'cors'
import pkg from '../generated/prisma/index.js';

//Constantes
const app = express()
const port = 7070
const { PrismaClient } = pkg;
const prisma = new PrismaClient()

//Determinando acesso para a aplicação realizar a comunicação!
app.use(cors({
  origin: 'http://localhost:3000'
}));

//Determinando e informando ao Node que iriei usar JSON no envio dos dados
app.use(express.json());

//Inicio Metodo GET
app.get('/api/v1/autor', async (req, res) => {
  try {
    const authors = await prisma.author.findMany()
    res.json(authors)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Erro ao buscar autores' })
  }
})

//API "GetByID"
app.get('/api/v1/autor/:numero', async (req, res) => {
  const numero = parseInt(req.params.numero) //ParseINT para garantir que vai receber um número, mesmo sendo tratado no Front
  try {
    const autorID = await prisma.author.findUnique({
      where: {
        numero: numero
      }
    })

    !autorID ? res.status(404).json({ warning: 'O ID enviado não corresponde a nenhum registro na base de dados' }) : null

    res.json(autorID)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Erro ao retorno o valor de ID' })
  }
})

//API "GetByID" Autor de cada livro
app.get('/api/v1/autor/:numero/livro', async (req,res) => {
  const nrAutorLivro = parseInt(req.params.numero) //Garantindo que será um número recebido pelo Front
  try{
    const autorID = await prisma.book.findMany({
      where: {
        numeroAutor : nrAutorLivro
      }
    })

    !autorID ? res.status(200).json({ warning: 'O ID enviado não corresponde a nenhum registro na base de dados' }) : null

    res.json(autorID)

  }catch(error){
    res.status(500).json({ error: 'Erro o efetuar o processamento diretamente na base de dados' })
  }
})

//Inicio Metodo POST
app.post('/api/v1/autor', async (req, res) => {

  await prisma.author.create({
    data: {
      numero: req.body.numero,
      nome: req.body.nome
    }
  })

  res.status(201).json({ message: 'Autor inserido com sucesso!' });
})

// API para inserção de livro baseado no número do autor
app.post('/api/v1/autor/:numero/livro', async (req, res) => {
  const numeroAutor = parseInt(req.body.numeroAutor);
  let autorEncontrado;
  
  try {
    autorEncontrado = await prisma.author.findUnique({
      where: {
        numero: numeroAutor 
      }
    });
  } catch (error) {
    console.error("Erro ao buscar autor:", error);
    return res.status(500).json({ error: "Erro ao buscar autor" });
  }

  if (!autorEncontrado) {
    return res.status(404).json({ warning: 'O número informado não corresponde a nenhum autor na base de dados' });
  }

  try {
    await prisma.book.create({
      data: {
        numero: req.body.numero,
        titulo: req.body.titulo,
        edicao: req.body.edicao,
        ISBN: req.body.ISBN,
        categoria: req.body.categoria,
        numeroAutor: numeroAutor 
      }
    });

    return res.status(201).json({ message: 'Livro criado com sucesso!' });
  } catch (error) {
    console.error("Erro ao criar livro:", error);
    return res.status(500).json({ error: "Erro ao criar livro" });
  }
})

//Debug de porta em funcionamento
app.listen(port, () => {
  console.log(`Back-End sendo executado na porta: ${port}`)
})

/*
Connection String:
UserName: impacta
Password: impacta@2025
lTxuw4xw2UFmETEd

*/