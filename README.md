Pokédex App - Projeto para BSN Tecnologia

video do app: https://drive.google.com/file/d/1hO7PCzWY3mgTZNCVvX0bbGXeljXx6Cew/view?usp=sharing

Este projeto foi desenvolvido como parte de um desafio para ingressar na BSN Tecnologia. Trata-se de uma aplicação completa estilo Pokédex, construída com Angular + Ionic, que consome a PokéAPI e possui autenticação, persistência de favoritos e funcionalidades de busca.
🛠️ Stack Utilizada
Front-end

    Angular 17

    Ionic Framework

    TypeScript

    RxJS

    NgModules Standalone

    SCSS

Back-end
https://github.com/gusgusz/poke-api/tree/master

    Laravel

    PHP

    JWT (JSON Web Token) para autenticação

    postegresSQL

    REST API para login, registro e favoritos por usuário

🔐 Funcionalidades do Back-End

    Login & Registro com autenticação via JWT

    Middleware de proteção de rotas autenticadas

    Gerenciamento de favoritos por usuário

        Favoritos são salvos por usuário no banco de dados

    Verificação de token no front-end para manter a sessão ativa

📲 Funcionalidades do Front-End
Tela de Home

    Lista de Pokémons com paginação (10/20/30/50 por página)

    Pesquisa por nome ou ID com sugestões automáticas

    Visualização de detalhes do Pokémon:

        Imagem oficial

        Tipos com ícones personalizados

        Altura, peso e habilidades

    Favoritar e desfavoritar Pokémon

    Botões de navegação:

        Ir para favoritos

        Logout

Tela de Favoritos

    Lista com todos os Pokémons marcados como favoritos

    Busca por favoritos com sugestões dinâmicas

    Botão para remover dos favoritos

    Navegação para detalhes

Componentes personalizados

    Chips com ícones de tipo Pokémon

    Layout responsivo com ion-grid

    Feedback visual e UX aprimorada

🧪 Testes Unitários

A aplicação conta com testes unitários escritos para a página Home, garantindo confiabilidade nas funcionalidades principais. Foram testados:

    Criação do componente

    Carregamento de Pokémons e favoritos

    Lógica de favoritar e desfavoritar

    Navegação para detalhes e tela de favoritos

    Logout e remoção de token

    Verificação de favoritos

Exemplo de teste:

it('should toggle favorite - remove when already favorited', () => {
  const mockPokemon = { id: 1, name: 'bulbasaur' };
  component.favorites = [{ poke_id: 1 }];
  component.toggleFavorite(mockPokemon);
  expect(favoriteServiceSpy.removeFavorite).toHaveBeenCalledWith(1);
});

    Os testes utilizam:

        Jasmine

        TestBed com HttpClientTestingModule

        RouterTestingModule

📂 Estrutura de Diretórios

src/
├── app/
│   ├── home/             # Página principal (lista, busca, favoritos)
│   ├── favorites/        # Tela de favoritos do usuário
│   ├── services/
│   │   ├── favorite.service.ts
│   │   └── auth.service.ts
│   ├── interceptors/
│   │   └── auth.interceptor.ts
│   └── auth/             # Login / Registro (no back-end)

🔒 Autenticação

    Ao realizar login, o token JWT é salvo no localStorage.

    Interceptor de autenticação (auth.interceptor.ts) insere automaticamente o token nas requisições.

    O token é removido ao fazer logout.

📤 Como Executar o Projeto
Requisitos

    Node.js (v18+)

    Angular CLI

    Ionic CLI

Rodando o Front-end

npm install
ionic serve

Rodando o Back-end

cd backend
npm install
npm run dev

🌟 Diferenciais

    Utilização de Ionic Standalone Components

    Icons customizados por tipo usando SVGs

    Persistência dos favoritos por usuário no back-end

    Sistema de sugestões inteligente durante a busca

    Design responsivo para dispositivos móveis

    Cobertura básica com testes unitários automatizados

🎯 Objetivo

Este projeto foi desenvolvido com muito cuidado e dedicação para demonstrar minhas habilidades como desenvolvedor Full Stack (Angular, Ionic, Node.js, Auth, Testes), com o objetivo de conquistar uma oportunidade profissional na BSN Tecnologia.

Agradeço a oportunidade de mostrar meu trabalho!
📧 Contato

    Nome: Gustavo Guimarães

    Email: gustavoguimaraescamps@gmail.com

