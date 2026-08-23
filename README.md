# Mural de Enquetes ao Vivo

Teste técnico Full Stack Júnior — FantasyDraft.

Aplicação onde qualquer pessoa cria uma enquete e outras pessoas votam. O resultado
aparece em tempo real na tela de todo mundo que está com a enquete aberta, sem F5.

## Stack

- **Backend:** Laravel 11 / PHP 8.3 / PostgreSQL
- **Frontend:** React 18 + Vite + CSS Modules
- **Tempo real:** servidor Node.js com a biblioteca `ws`

## Estrutura

```
mural-enquetes/
├── backend/     API em Laravel
├── frontend/    interface em React
└── websocket/   servidor WebSocket em Node.js
```

## Como funciona o tempo real

1. O usuário vota e o React chama `POST /api/polls/{id}/votes`.
2. O Laravel grava o voto e envia os resultados atualizados por HTTP para o servidor WebSocket (`POST /broadcast`).
3. O servidor WebSocket repassa a mensagem para todos os clientes conectados naquela enquete.
4. O React recebe a mensagem e atualiza as barras na hora.

Optei por esse caminho (Laravel → HTTP → Node → WebSocket) porque o enunciado pede o
WebSocket em Node.js. Assim o Laravel continua sendo só uma API REST e o Node cuida
apenas de distribuir as mensagens.

## Rodando o projeto

Pré-requisitos: PHP 8.3, Composer, PostgreSQL e Node.js 18+.

### 1. Banco de dados

Crie um banco vazio no PostgreSQL:

```bash
createdb mural_enquetes
```

### 2. Backend (porta 8000)

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

O seeder cria um usuário demo e imprime o token da API: `demotoken`.

### 3. WebSocket (porta 8080)

```bash
cd websocket
npm install
npm start
```

### 4. Frontend (porta 5173)

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Abra `http://localhost:5173` em duas abas, vote em uma e veja a outra atualizar sozinha.

### Testes

```bash
cd backend
php artisan test
```

Os testes rodam em SQLite em memória (configurado no `phpunit.xml`), então não precisam
do PostgreSQL ligado.

## Endpoints

Todas as rotas estão sob `middleware('auth:sanctum')` e esperam o header
`Authorization: Bearer demotoken`.

| Método | Rota                     | Descrição                      |
| ------ | ------------------------ | ------------------------------ |
| GET    | `/api/polls`             | lista as enquetes              |
| POST   | `/api/polls`             | cria uma enquete               |
| GET    | `/api/polls/{id}`        | resultado atual de uma enquete |
| POST   | `/api/polls/{id}/votes`  | registra um voto               |

Exemplo de resposta (JSON direto, sem wrapper `data`):

```json
{
  "id": 1,
  "question": "Qual o melhor jogador da rodada?",
  "closes_at": "2026-08-23T18:00:00+00:00",
  "closed": false,
  "total_votes": 3,
  "options": [
    { "id": 1, "text": "Jogador A", "votes": 2, "percentage": 66.7 },
    { "id": 2, "text": "Jogador B", "votes": 1, "percentage": 33.3 }
  ]
}
```

## Decisões que tomei

- **Autenticação:** o enunciado pede rotas com `auth:sanctum` mas não pede login/cadastro.
  Resolvi criando um usuário demo no seeder com um token fixo (`demotoken`), que o frontend
  envia no header. Assim o middleware está de fato protegendo as rotas, sem precisar de
  telas de login. Em produção esse token viria de um endpoint de login.
- **Quem é o votante:** como não existe login, cada navegador gera um `voter_id` (UUID) e
  guarda no `localStorage`. O banco tem um índice único em `(poll_id, voter_id)` e o
  backend recusa o segundo voto com 422. O frontend também desabilita as opções depois de
  votar, para não deixar o usuário tentar de novo à toa.
- **Encerramento automático:** o criador informa a duração em segundos. Guardo `closes_at`
  na enquete; o backend recusa votos depois desse horário e o frontend mostra um contador
  regressivo e desabilita as opções quando chega a zero.
- **Chaves primárias:** todas as tabelas usam `id()` (inteiro auto-increment), sem UUID.
- **Sem wrapper `data`:** os controllers devolvem arrays direto, sem API Resources.

## Diferenciais implementados

- Testes automatizados (PHPUnit) para voto duplicado e para rota protegida.
- Encerramento automático da enquete por tempo definido pelo criador.
- Animação nas barras de resultado (`transition` no CSS) quando chega um voto novo.
- Bloqueio de voto duplicado também no frontend.

## Tempo gasto e partes mais difíceis

Levei cerca de 10 horas no total.

A parte mais difícil foi decidir como ligar o Laravel ao servidor WebSocket, já que os dois
são processos separados e em linguagens diferentes. Testei broadcast direto do PHP e acabei
escolhendo um endpoint HTTP simples no Node, que é mais fácil de entender e de debugar.

A segunda parte mais chata foi garantir que a tela não ficasse "brigando" entre o resultado
que volta do POST do voto e o resultado que chega pelo WebSocket. Resolvi deixando um único
estado (`poll`) no `PollView`, atualizado pelas duas fontes.
