//Variavel de ambiente para conexão a aplicação
const BASE_URL = 'http://localhost:7070';

//Obter Todos os registros de autores
export async function getAuthor() {
    const response = await fetch(`${BASE_URL}/api/v1/autor`, {
        method: 'GET'
    })

    if (response.status !== 200) throw new Error()

    const data = await response.text();
    return data;
}

//Obter autor especifico
export async function getAuthorID(numero:number) {
    const response = await fetch(`${BASE_URL}/api/v1/autor/${numero}`,{
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'            
        },
    })

    if(response.status !== 200) throw new Error()

    return await response.json()    
}

//Método para Inserir o Autor
export async function inserirAutor(numero: number, nome: string){
    const response = await fetch(`${BASE_URL}/api/v1/autor`,{
        method: 'POST',
        headers:{
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({numero,nome})
    })

    return response.status
}

//Método para Inserir o Livro
export async function inserirLivro(numero: number, titulo: string,edicao: string, ISBN: string, categoria: string, numeroAutor: number){ //O campo numero se refere ao autor
    const response = await fetch(`${BASE_URL}/api/v1/autor/${numeroAutor}/livro`,{
        method: 'POST',
        headers:{
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({numero,titulo,edicao,ISBN,categoria,numeroAutor})
    })

    return response.status
}

//Obter Livro de autor especifico
export async function getBookByAuthorID(nrAutorLivro:number) {
    const response = await fetch(`${BASE_URL}/api/v1/autor/${nrAutorLivro}/livro`,{
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'            
        },
    })

    if(response.status !== 200) throw new Error()

    return await response.json()    
}