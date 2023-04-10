const puppeteer = require('puppeteer');
const http = require('http');
const { URL } = require('url');
const fs = require('fs').promises;

const hostname = 'localhost';
const port = 3000;

const server = http.createServer(async (req, res) => {
  const path = new URL(req.url, 'http://localhost:3000').pathname;

  if (path === '/') {
    const html = await fs.readFile('./index.html');
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(html);
  } else if (path === '/search') {
    const query = new URL(req.url, 'http://localhost:3000').searchParams.get('q'); // Get the 'q' query parameter
    const url = `https://www.perplexity.ai/search?q=${query}`;

    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    await page.goto(url, { waitUntil: 'networkidle2' });
    const divText = await page.$eval('#__next > main > div > div.grow.border-zinc-200.dark\\:border-zinc-800.divide-zinc-200.dark\\:divide-zinc-800.transition.duration-300.bg-zinc-300.dark\\:bg-darkDeep > div > div > div > div.md\\:col-span-8.h-full.border-x.border-zinc-200.dark\\:border-zinc-800.divide-zinc-200.dark\\:divide-zinc-800.transition.duration-300.bg-transparent > div.pb-\\[60px\\].md\\:pb-0 > div > div > div > div.border-zinc-200.dark\\:border-zinc-800.divide-zinc-200.dark\\:divide-zinc-800.transition.duration-300.bg-transparent > div:nth-child(2) > div > div.default.font-sans.text-base.text-zinc-800.dark\\:text-zinc-300.selection\\:bg-super.selection\\:text-white.dark\\:selection\\:bg-opacity-50.selection\\:bg-opacity-70 > div', div => div.textContent.trim());
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end(divText);
    console.log(divText);
    console.log('Done');
    await browser.close();
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
