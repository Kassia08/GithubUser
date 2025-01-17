import { GithubUser } from "./GithubUser.js"

/* O    RETURN FETCH também poderia estar escrito das seguintes formas, o importante é saber
que qualquer uma delas está correta:

***
    return fetch(endpoint)
        .then(data => data.json())
        .then(data) => ({
            login: data.login,
            name: data.name,
            public_repos: data.public_repos,
            followers: data.followers
        }))


***
    return fetch(endpoint)
        .then(data => data.json())
        .then(data) => {
             
            const { login, name, public_repos, followers } = data         // Aqui será uma função
            

            return {
            login: login,                           // Aqui sem Shorthand
            name: name,                             // Aqui sem Shorthand
            public_repos: public_repos,             // Aqui sem Shorthand
            followers: followers                    // Aqui sem Shorthand
            } 
        })


***
     return fetch(endpoint)
        .then(data => data.json())
        .then(({ login, name, public_repos, followers }) => ({   
            login: data.login,
            name: data.name,
            public_repos: data.public_repos,
            followers: data.followers            
        }))

***    Com essa desestruturação
    return fetch(endpoint)
        .then(data => data.json())
        .then(({ login,
        name,
        public_repos,
        followers 
        }) => ({   
        login,                  
        name,                   
        public_repos,           
        followers               
        }))

*/


export class Favorites {
    constructor(root) {
        this.root = document.querySelector(root)
        this.load()

    GithubUser.search('maykbrito').then(user => console.log(user))
    }

    load() {
    // const entries
    this.entries  =  JSON.parse(localStorage.getItem('@github-favorites:'))  || []
    // Nome da minha KEY      @github-favorites

     //  console.log(this.entries)

    /*
    OS DADOS SERÃO UM ARRAY CONTENDO UM OBJETO:
    this.entries = [
        {
            login: 'Kassia08',
            name: "Kássia Moura",
            public_repos: '33',
            followers: '3'
        },
        {
            login: 'maykbrito',
            name: "Mayk Brito",
            public_repos: '76',
            followers: '9589'
        }
    ] */ 
    }


    save() {
        localStorage.setItem('@github-favorites:', JSON.stringify(this.entries))
    }

    async add(username) {
        // const GithubUser = await GithubUser.search(username)
        // Tenho que deixar da seguinte forma, caso alguma promessa tenha algum ERRO:
        try {

            const userExists = this.entries.find(entry => entry.login === username)

            if(userExists) {
                throw new Error('Usuário já cadastrado')
            }

            const user = await GithubUser.search(username)
            
            if(user.login === undefined) {
                throw new Error('Usuário não encontrado!')
            }

            this.entries = [user, ...this.entries]
            this.update()
            this.save()


        } catch(error) {
            alert(error.message)
        }
        
    }

    delete(user) {
        // Higher-order functions (MAIS USADAS: map, filter, find, reduce)
        const filteredEntries = this.entries
        .filter(entry => entry.login !== user.login)

        this.entries = filteredEntries
        this.update()
        this.save()
    }
}

export class FavoritesView extends Favorites {
    constructor(root) {
        super(root)

        this.tbody = this.root.querySelector('table tbody')

        this.update()
        this.onadd()
    }

    onadd() {
        const addButton = this.root.querySelector('.search button')
        addButton.onclick = () => {
            const { value } = this.root.querySelector('.search input')

            this.add(value)
        }
    }

    update() {
        this.removeAllTr()


        this.entries.forEach( user => {
            const row = this.createRow()
            
            row.querySelector('.user img').src = `https://github.com/${user.login}.png`
            row.querySelector('.user img').alt = `Imagem de ${user.name}`

            row.querySelector('.user a').href = `https://github.com/${user.login}`

            row.querySelector('.user p').textContent = user.name

            row.querySelector('.user span').textContent = user.login

            row.querySelector('.repositories').textContent = user.public_repos

            row.querySelector('.followers').textContent = user.followers

            // row.querySelector('.remove').addEventListener    
            // OU faço da seguinte forma (Se for mais de um evento de clique tem que ser o 'addEventListener' SEMPRE):
            row.querySelector('.remove').onclick = () => {
            const isOk = confirm('Tem certeza que deseja deletar essa linha?')
            if(isOk) {
                this.delete(user)
            }
            }

            this.tbody.append(row)
    })

    }

    createRow() {
        const tr = document.createElement('tr')

        // const content = `      **OU EU POSSO SIMPLIFICAR
        tr.innerHTML = `
            <td class="user">
                <img src="http://github.com/Kassia08.png" alt="Imagem de kassia08">
                    <a href="https://github.com/Kassia08" target="_blank">
                        <p>Kássia Moura</p>
                            <span>Kassia08</span>
                    </a>
            </td>
            <td class="repositories">
                33
            </td>
            <td class="followers">
                3
            </td>
            <td>
                <button class="remove">&times;</button>
            </td>
    `

    // tr.innerHTML = content    **OU EU POSSO SIMPLIFICAR
    return tr 
    }

    removeAllTr() {
        this.tbody.querySelectorAll('tr')
            .forEach((tr) => {
                tr.remove()
         })
    }
}