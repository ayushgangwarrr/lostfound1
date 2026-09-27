Load tests for Lost & Found backend

Overview
- `http-k6.js` — k6 script to exercise auth, list, search, and create endpoints.
- `generate_test_data.js` — Node script to create test users, item reports, and conversations. Outputs `users.json` in this folder.
- `socketio/run.js` — Node socket.io-client benchmark that uses `users.json` and created conversations to open connections and send messages.

Environment variables (used by scripts)
- `BASE_URL` — base HTTP url (default: http://localhost:5000)
- `WS_URL` — socket.io url (default: ws://localhost:5000)
- `USERS` — number of users to generate (default: 10)
- `REPORTS_PER_USER` — reports per user (default: 5)
- `DURATION` — duration for k6 or socket tests (default: 60s)
- `VUS` — virtual users for k6 (default: 50)

Quick commands (from repo root)
1. Generate test data (creates `load-tests/users.json`):

```bash
cd load-tests
BASE_URL=http://localhost:5000 USERS=20 REPORTS_PER_USER=3 node generate_test_data.js
```

2. Run HTTP load test with k6 (install k6 separately):

```bash
k6 run --vus 50 --duration 1m http-k6.js
```

3. Run socket benchmark (requires `users.json`):

```bash
node socketio/run.js
```

Notes
- The scripts are scaffolds to run reproducible load. Adjust env vars for your machine. The socket benchmark expects `load-tests/users.json` produced by `generate_test_data.js`.
