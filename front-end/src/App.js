import { useState } from 'react';
import './App.css';
import { getAuthor, getAuthorID, inserirAutor, inserirLivro, getBookByAuthorID } from './services/services.ts';

function App() {

  const [method, setMethod] = useState("");
  const [autores, setAutores] = useState("");
  const [numero, setNumero] = useState("");
  const [AutorID, setAutorID] = useState(null);
  const [nNumero, setnNumero] = useState("");
  const [nNome, setnNome] = useState("");
  const [numeroLivro, setnumeroLivro] = useState("");
  const [tituloLivro, settituloLivro] = useState("");
  const [edicaoLivro, setedicaoLivro] = useState("");
  const [ISBNLivro, setISBNLivro] = useState("");
  const [categoriaLivro, setcategoriaLivro] = useState("");
  const [nrAutorLivro, setnrAutorLivro] = useState("");
  const [BookID, setBookID] = useState(null);
  const [loading, setLoading] = useState(false);

  //Obter todos os autores
  async function obterAutores() {
    setLoading(true);
    try {
      const data = await getAuthor();
      const json = JSON.parse(data);

      if (json.length > 0) {
        setAutores(json);
      } else {
        alert("Nenhum autor encontrado!");
      }
    } catch (err) {
      console.error('Erro durante a obtenção dos dados:', err);
    }finally{
      setLoading(false)
    }
  }

  //Obter Autor Especifico
  async function obterAutorNumero(numero) {
    setLoading(true);
    try {
      const data = await getAuthorID(numero)
      setAutorID(data)

      if (data.warning) {
        alert(data.warning); 
        setAutorID(null); 
        return;
      }
      return data

    } catch (error) {
      alert("Nenhum autor encontrado com essa chave mencionada ", error);
      return null
    }finally{
      setLoading(false);
    }
  }

  //Inserir Autor
  async function inserirnAutor() {
    setLoading(true);
    if (nNumero.length === 0 || nNome.length === 0) {
      alert("Preencha o nome e o número do autor");
      return;
    }

    const data = await obterAutorNumero(nNumero);

    if (data) {
      alert("Esse autor já existe na base de dados, gentileza modificar o número!");
    } else {
      try {
        await inserirAutor(parseInt(nNumero), nNome);
        alert("Autor inserido com sucesso!")
      } catch (error) {
        alert("Erro no metodo de inserção de Autor", error)
      }finally{
        setLoading(false);
      }
    }
  }

  async function inserirnLivro() {
    if (numeroLivro.length === 0 || tituloLivro.length === 0 || edicaoLivro.length === 0 || ISBNLivro.length === 0 || categoriaLivro.length === 0 || nrAutorLivro.length === 0) {
      alert("Todos os campos possuem a obrigatoriedade do preenchimento!")
      return;
    }
    setLoading(true);

    const data = await obterAutorNumero(nrAutorLivro);

    if (!data) {
      alert("O autor informado não existe cadastrado na base de dados do ambiente! Autor padrão 999!")
    } else {
      try {
        await inserirLivro(parseInt(numeroLivro), tituloLivro, edicaoLivro, ISBNLivro, categoriaLivro, nrAutorLivro)
        alert("Livro Inserido com exito!")
      } catch (error) {
        alert("Erro no metodo de inserção de livro")
      }finally{
        setLoading(false);
      }
    }
  }

  //Metodo para Buscar todos os livros de um autor
  async function buscarLivrosAutor(nrAutor) {
    setLoading(true);
    try {
      const data = await getBookByAuthorID(nrAutor)
      setBookID(data)
      console.log(data)

      if(data.length === 0){
        alert("Não há registros na base de dados para os filtros efetuados!")
        setLoading(false);
      }
      
      if (data.warning) {
        alert(data.warning); 
        setBookID(null);
        setLoading(false);     
        return;
      }
      return data

    } catch (error) {
      alert("Erro no método obterAutorNumero: ", error);
      setLoading(false);
      return null
    }finally{
      setLoading(false);
    }
    
  }

  return (
    <div>
      <form>
        <div className="App">
          <fieldset className="FildSetAuthor">
            <legend>Manipulação de Dados</legend>
            <div>
              <input type="radio" id="POST" name="method" value="POSTAUTHOR" checked={method === "POSTAUTHOR"} onChange={(e) => setMethod(e.target.value)} />
              <label htmlFor="POST">Metodo POST Autor</label>
              <input type="radio" id="POST1" name="method" value="POST1AUTHOR" checked={method === "POST1AUTHOR"} onChange={(e) => setMethod(e.target.value)} />
              <label htmlFor="POST">Metodo POST Livro</label>
              <input type="radio" id="GETAUTHORID" name="method" value="GETAUTHORID" checked={method === "GETAUTHORID"} onChange={(e) => setMethod(e.target.value)} />
              <label>GET Author ID</label>
              <input type="radio" id="GET" name="method" value="GETAUTHOR" checked={method === "GETAUTHOR"} onChange={(e) => setMethod(e.target.value)} />
              <label>Método GET Autor</label>
              <input type="radio" id="GETBOOKID" name="method" value="GETBOOKID" checked={method === "GETBOOKID"} onChange={(e) => setMethod(e.target.value)} />
              <label>GET Livro Autor ID</label>
            </div>
            <div className="Fields">
              {method === "GETAUTHOR" && (
                <div>
                  <div>
                    <h3>Campos para GET</h3>
                    <button type="button" onClick={obterAutores}>Chamar Método GET</button>
                  </div>
                  <div>
                  {loading && <div className="spinner"></div>}
                    {autores.length > 0 && (
                      <table border="1" style={{ marginTop: '20px', width: '100%' }}>
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>Número</th>
                            <th>Nome</th>
                          </tr>
                        </thead>
                        <tbody>
                          {autores.map((autor) => (
                            <tr>
                              <td>{autor.id}</td>
                              <td>{autor.numero}</td>
                              <td>{autor.nome}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              )}
              {method === "POSTAUTHOR" && (
                <div>
                  <div>
                    <h3>Inserção de Autor</h3>
                    <label>Nome do Autor: </label>
                    <input type="text" onChange={(e) => setnNome(e.target.value)} />
                  </div>
                  <div>
                    <label>Numero Autor: </label>
                    <input type="number" onChange={(e) => setnNumero(e.target.value)} />
                  </div>
                  <button type="button" onClick={() => inserirnAutor()}>Enviar Registro</button>
                  {loading && <div className="spinner"></div>}
                </div>                               
              )}
              
              {method === "POST1AUTHOR" && (
                <div>
                  <div>
                    <h3>Inserir Livro</h3>
                    <label>Numero do Livro: </label>
                    <input type="number" onChange={(e) => setnumeroLivro(e.target.value)} />
                  </div>
                  <div>
                    <labe>Titulo Livro: </labe>
                    <input type="text" onChange={(e) => settituloLivro(e.target.value)} />
                  </div>
                  <div>
                    <label>Edição do Livro: </label>
                    <input type="text" onChange={(e) => setedicaoLivro(e.target.value)} />
                  </div>
                  <div>
                    <label>ISBN: </label>
                    <input type='text' onChange={(e) => setISBNLivro(e.target.value)}></input>
                  </div>
                  <div>
                    <label>Categoria: </label>
                    <input type='text' onChange={(e) => setcategoriaLivro(e.target.value)}></input>
                  </div>
                  <div>
                    <label>Numero do Autor: </label>
                    <input type='number' onChange={(e) => setnrAutorLivro(e.target.value)}></input>
                  </div>
                  <div>
                    <button type='button' onClick={() => inserirnLivro()}>Enviar Registro</button>
                    {loading && <div className="spinner"></div>}
                  </div>
                </div>
              )}
              {method === "GETAUTHORID" && (
                <div>
                  <div>
                    <label>Numero do Autor: </label>
                    <input type="Text" onChange={(e) => setNumero(e.target.value)} /><br />
                    <button type="button" onClick={() => obterAutorNumero(numero)}>Buscar Registro</button>
                    {loading && <div className="spinner"></div>}
                  </div>
                  <div>
                    {AutorID && (
                      <table border="1" style={{ marginTop: '20px', width: '100%' }}>
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>Número</th>
                            <th>Nome</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>{AutorID.id}</td>
                            <td>{AutorID.numero}</td>
                            <td>{AutorID.nome}</td>
                          </tr>
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              )}
              {method === 'GETBOOKID' && (
                <div>
                  <div>
                    <h3>Buscar Livro por Autor</h3><br/>
                    <label>Numero do Autor: </label>
                    <input type="Text" onChange={(e) => setnrAutorLivro(e.target.value)} /><br />
                    <button type="button" onClick={() => buscarLivrosAutor(nrAutorLivro)}>Buscar Registro</button>
                    {loading && <div className="spinner"></div>}
                  </div>
                  <div>
                    {BookID && (
                      <table border="1" style={{ marginTop: '20px', width: '100%' }}>
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>Número</th>
                            <th>Titulo</th>
                            <th>Edição</th>
                            <th>ISBN</th>
                            <th>Categoria</th>
                            <th>Autor</th>
                          </tr>
                        </thead>
                        <tbody>
                          {BookID.map((BookID) => (
                          <tr>
                            <td>{BookID.id}</td>
                            <td>{BookID.numero}</td>
                            <td>{BookID.titulo}</td>
                            <td>{BookID.edicao}</td>
                            <td>{BookID.ISBN}</td>
                            <td>{BookID.categoria}</td>
                            <td>{BookID.numeroAutor}</td>
                          </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              )}
            </div>
          </fieldset>
        </div>
      </form>
    </div >

  );
}

export default App;
