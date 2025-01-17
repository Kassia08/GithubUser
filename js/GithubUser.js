export class GithubUser {
    static search(username) {
        const endpoint = `https://api.github.com/users/${username}`

        // Forma simplificada de escrever o RETURN FETCH: 
        return fetch(endpoint)
        .then(data => data.json())
        .then(({ login, name, public_repos, followers }) => ({   // Com uma idéia de desestruturar ele aqui, diretamente com argumento
            login,                  // E aqui consigo utilizar o Shorthand
            name,                   // E aqui consigo utilizar o Shorthand
            public_repos,           // E aqui consigo utilizar o Shorthand
            followers               // E aqui consigo utilizar o Shorthand
        }))

      //  .catch( e => console.log('encontrei o erro', e))    Exemplo de usar o CATCH aqui para mostar um ERRO
    }
}