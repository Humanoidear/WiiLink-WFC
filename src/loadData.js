import { promises as fs } from 'fs';

export default async function(req, res) {
  try {
    const data = JSON.parse(await fs.readFile('./public/json/subtest.json', 'utf-8'));
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
  } catch (error) {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Error reading data' }));
  }
}