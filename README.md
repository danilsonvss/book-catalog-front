# Aplicação front-end para consumo da API de cadastro de livros criada com Laravel e Docker https://github.com/danilsonvss/book-catalog-back

## Confugurando o .env

Para que a aplicação funcione da forma correta, informe a url base para a API adicionando ao .env.
```bash
cp .env.example .env.local

```

Exemplo de configuração do `.env.local`:
```
REACT_APP_BASE_URL=http://localhost/api

```

## Instalação
Rode os comandos abaixo para instalar as dependências do projeto e rodar a aplicação.

```bash
yarn install
yarn start
```

## Atenticação
Após carregar a tela de login, forneça os seguintes dados
```
E-mail: usuario@bookcatalog.com
Senha: senha
```
