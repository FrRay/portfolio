const fs = require('node:fs/promises');
const user = 'FrRay';
async function main() {
  const repositories = [];
  for (let page = 1; ; page++) {
    const response = await fetch(`https://api.github.com/users/${user}/repos?type=owner&sort=updated&per_page=100&page=${page}`, {
      headers: { 'User-Agent': 'FrRay-portfolio', 'Accept': 'application/vnd.github+json', ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}) }
    });
    if (!response.ok) throw new Error(`GitHub API returned ${response.status}`);
    const batch = await response.json();
    if (!Array.isArray(batch)) throw new Error('Unexpected GitHub API response');
    for (const { name, html_url, description, fork, language, stargazers_count, updated_at, private: isPrivate } of batch) {
      if (isPrivate === false) repositories.push({ name, html_url, description, fork, language, stargazers_count, updated_at });
    }
    if (batch.length < 100) break;
  }
  await fs.writeFile('repositories.json', JSON.stringify({ updated_at: new Date().toISOString(), repositories }, null, 2) + '\n');
  console.log(`Saved ${repositories.length} public repositories`);
}
main().catch(error => { console.error(error.message); process.exitCode = 1; });
