export default async function handler(req, res) {
  if (req.query.secret !== process.env.SECRET_KEY) {
    return res.status(403).json({ error: 'forbidden' });
  }

  const { user_id, action } = req.query;

  if (!user_id || !action) {
    return res.status(400).json({ error: 'missing user_id or action' });
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

  if (data.error?.error_code === 5) {
    return res.status(401).json({ error: 'token_expired' });
  }

  res.status(200).json(data);
}
