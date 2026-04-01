import http from 'http';
import { parse } from 'url';

const server = http.createServer(async (req, res) => {
  const { query } = parse(req.url, true);

  if (query.secret !== process.env.SECRET_KEY) {
    res.writeHead(403);
    return res.end(JSON.stringify({ error: 'forbidden' }));
  }

  const { user_id, action } = query;

  if (!user_id || !action) {
    res.writeHead(400);
    return res.end(JSON.stringify({ error: 'missing params' }));
  }

  const method = action === 'approve'
    ? 'groups.approveRequest'
    : 'groups.removeUser';

  const url = `https://api.vk.com/method/${method}` +
    `?group_id=${process.env.VK_GROUP_ID}` +
    `&user_id=${user_id}` +
    `&access_token=${process.env.VK_USER_TOKEN}` +
    `&v=5.199`;

  const response = await fetch(url);
  const data = await response.json();

  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
});

server.listen(process.env.PORT || 3000);
