# My Website v2

## Descrição
Este projeto é uma aplicação web desenvolvida em Typescript composta por um backend desenvolvido com NestJS e um frontend utilizando Next.js. O objetivo do projeto é fornecer funcionalidades úteis para mim pessoalmente, com funções relacidas aos meus hobbies.

## Estrutura do Projeto

O projeto está organizada da seguinte forma:

- **backend/**: Contém o código do servidor backend desenvolvido com NestJS.
  - **assets/**: Arquivos estáticos como fontes e imagens.
  - **public/**: Imagens públicas acessíveis diretamente.
  - **scripts/**: Scripts Python para manipulação de imagens.
  - **src/**: Código-fonte do backend, incluindo controladores, módulos e serviços.
- **frontend/**: Contém o código do cliente frontend desenvolvido com Next.js.
  - **public/**: Imagens e ícones públicos.
  - **src/**: Código-fonte do frontend, incluindo componentes, páginas e estilos.
- **redis/**: Contém o dump do banco de dados Redis.

## Tecnologias Utilizadas

- **Backend**:
  - NestJS
  - Redis (para cache)

- **Frontend**:
  - Next.js
  - React

- **Outras Ferramentas**:
  - Python (para scripts de manipulação de imagens)
  - Docker Compose

## Configuração e Execução

### Pré-requisitos

- Node.js
- Docker e Docker Compose
- Python (para executar scripts opcionais)

### Passos para Configuração

1. Clone o repositório:
   ```bash
   git clone https://github.com/Giojoe10/my_website_v2
   cd my_website_v2
   ```

2. Inicie o serviço do redis
    ```bash
    docker compose up redis
    ```

3. Configure o backend:
   ```bash
   cd backend
   npm install
   npm run start:dev
   ```

4. Configure o frontend:
   ```bash
   cd ../frontend
   npm install
   npm run start:dev
   ```

5. Acesse a aplicação no navegador:
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Backend: [http://localhost:5000/docs](http://localhost:5000/docs)

## Scripts Úteis

- **Backend**:
  - `npm run start:dev`: Inicia o backend em modo de desenvolvimento.

- **Frontend**:
  - `npm run start:dev`: Inicia o frontend em modo de desenvolvimento.

- **Scripts Python**:
  - `generate_want_image.py`: Gera imagens específicas.
  - `trim_image.py`: Recorta imagens.
