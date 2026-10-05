import fs from 'fs';
import path from 'path';
import https from 'https';

const urls = {
  home: "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzAwMDY1ZDE4MmNmYjMwYzcwNzkyZjRlMTYxMDRhMDI4EgsSBxDst__VzgEYAZIBIwoKcHJvamVjdF9pZBIVQhM5OTQzMDQyNjAwNTAwMDM4NjM4&filename=&opi=89354086",
  article: "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzAwMDY1ZDE4NDMwNzFjYjcwNzNhZjFiYWY1MDU5Y2U2EgsSBxDst__VzgEYAZIBIwoKcHJvamVjdF9pZBIVQhM5OTQzMDQyNjAwNTAwMDM4NjM4&filename=&opi=89354086",
  dashboard: "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzAwMDY1ZDE4NDIzMzM5N2MwMmE5OWZlOWI4MWE2NWI0EgsSBxDst__VzgEYAZIBIwoKcHJvamVjdF9pZBIVQhM5OTQzMDQyNjAwNTAwMDM4NjM4&filename=&opi=89354086",
  studio: "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzAwMDY1ZDE4NDE4YzNlM2YwMzM4NWMyNTI4MjcxNTdlEgsSBxDst__VzgEYAZIBIwoKcHJvamVjdF9pZBIVQhM5OTQzMDQyNjAwNTAwMDM4NjM4&filename=&opi=89354086"
};

const outDir = path.join(process.cwd(), 'raw_screens');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

function downloadFile(url, key) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return downloadFile(res.headers.location, key).then(resolve).catch(reject);
      }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const filePath = path.join(outDir, `${key}.html`);
        fs.writeFileSync(filePath, data, 'utf8');
        console.log(`Downloaded ${key}.html (${data.length} bytes)`);
        resolve(data);
      });
    }).on('error', reject);
  });
}

async function main() {
  for (const [key, url] of Object.entries(urls)) {
    await downloadFile(url, key);
  }
}

main();
