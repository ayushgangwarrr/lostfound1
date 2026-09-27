import { io } from 'socket.io-client';
import fs from 'fs';

const BASE_URL = process.env.WS_URL || 'http://localhost:5000';
const USERS_FILE = process.env.USERS_FILE || 'users.json';
const CONNECTIONS = Number(process.env.CONNECTIONS || 10);
const MESSAGES_PER_CONN = Number(process.env.MESSAGES_PER_CONN || 10);

const users = JSON.parse(fs.readFileSync(USERS_FILE));

const run = async () => {
  const conns = [];
  for (let i = 0; i < Math.min(CONNECTIONS, users.length); i++) {
    const u = users[i];
    if (!u.token) continue;
    const socket = io(BASE_URL, { extraHeaders: { cookie: `token=${u.token}` } });
    conns.push({ socket, user: u });
    socket.on('connect', () => { console.log('connected', u.user?.email); });
    socket.on('connect_error', (err) => { console.error('connect_error', err.message); });
  }

  // wait for connections
  await new Promise((r) => setTimeout(r, 2000));

  // send messages
  for (const c of conns) {
    for (let m = 0; m < MESSAGES_PER_CONN; m++) {
      c.socket.emit('sendMessage', { conversationId: c.user?.user?._id, text: `hi ${m}` });
    }
  }

  // wait then disconnect
  await new Promise((r) => setTimeout(r, 2000));
  conns.forEach((c) => c.socket.close());
  console.log('done');
};

run().catch((e) => { console.error(e); process.exit(1); });
