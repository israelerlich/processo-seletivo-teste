const http = require('http');
const { WebSocketServer } = require('ws');

const PORT = process.env.PORT || 8080;
const SECRET = process.env.WEBSOCKET_SECRET || 'segredo-local';

const server = http.createServer((request, response) => {
  if (request.method !== 'POST' || request.url !== '/broadcast') {
    response.writeHead(404);
    response.end();
    return;
  }

  let body = '';

  request.on('data', (chunk) => {
    body += chunk;
  });

  request.on('end', () => {
    let payload;

    try {
      payload = JSON.parse(body);
    } catch (error) {
      response.writeHead(400);
      response.end();
      return;
    }

    if (payload.secret !== SECRET) {
      response.writeHead(401);
      response.end();
      return;
    }

    broadcast(payload.poll);

    response.writeHead(204);
    response.end();
  });
});

const wss = new WebSocketServer({ server });

wss.on('connection', (socket) => {
  socket.pollId = null;

  socket.on('message', (raw) => {
    try {
      const message = JSON.parse(raw);

      if (message.type === 'subscribe') {
        socket.pollId = Number(message.pollId);
      }
    } catch (error) {
      socket.pollId = null;
    }
  });
});

function broadcast(poll) {
  if (!poll) {
    return;
  }

  const message = JSON.stringify({ type: 'poll.updated', poll });

  wss.clients.forEach((client) => {
    if (client.readyState === client.OPEN && client.pollId === poll.id) {
      client.send(message);
    }
  });
}

server.listen(PORT, () => {
  console.log(`Servidor WebSocket rodando em ws://localhost:${PORT}`);
});
