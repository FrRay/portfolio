const GITHUB_USER = 'FrRay';
const grid = document.querySelector('#projects-grid');
const search = document.querySelector('#search');
const language = document.querySelector('#language');
const count = document.querySelector('#result-count');
let repositories = [];
document.querySelector('#year').textContent = new Date().getFullYear();
const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const date = value => new Intl.DateTimeFormat('zh-CN', {year:'numeric', month:'short', day:'numeric'}).format(new Date(value));
function render() {
  const term = search.value.trim().toLowerCase();
  const filtered = repositories.filter(repo => (!language.value || repo.language === language.value) && `${repo.name} ${repo.description || ''}`.toLowerCase().includes(term));
  count.textContent = `共 ${filtered.length} 个项目`;
  if (!filtered.length) { grid.innerHTML = '<div class="state">没有找到符合条件的项目。换个关键词试试吧 ✧</div>'; return; }
  grid.innerHTML = filtered.map((repo, index) => `<a class="project-card" href="${escapeHtml(repo.html_url)}" target="_blank" rel="noopener noreferrer"><div class="card-top"><span class="folder folder-${index % 4}">✦</span><span class="card-arrow">↗</span></div><div class="card-title">${escapeHtml(repo.name)} ${repo.fork ? '<span class="fork">FORK</span>' : ''}</div><p>${escapeHtml(repo.description || '这个项目还没有填写简介。')}</p><div class="card-bottom"><span><i class="language-dot"></i>${escapeHtml(repo.language || '未分类')}</span><span>☆ ${repo.stargazers_count}</span><span class="card-date">${date(repo.updated_at)}</span></div></a>`).join('');
}
async function loadRepositories() {
  grid.innerHTML = '<div class="state">正在从 GitHub 加载项目 <span class="loading">✳</span></div>';
  count.textContent = '正在寻找项目...';
  try {
    const all = [];
    for (let page = 1; ; page++) {
      const response = await fetch(`https://api.github.com/users/${encodeURIComponent(GITHUB_USER)}/repos?type=owner&sort=updated&per_page=100&page=${page}`, {headers:{Accept:'application/vnd.github+json'}});
      if (!response.ok) throw new Error(`GitHub API ${response.status}`);
      const batch = await response.json();
      if (!Array.isArray(batch)) throw new Error('Invalid response');
      all.push(...batch);
      if (batch.length < 100) break;
    }
    repositories = all;
    const languages = [...new Set(all.map(repo => repo.language).filter(Boolean))].sort((a,b) => a.localeCompare(b));
    language.innerHTML = '<option value="">所有语言</option>' + languages.map(item => `<option value="${escapeHtml(item)}">${escapeHtml(item)}</option>`).join('');
    render();
  } catch (error) {
    count.textContent = '项目暂时无法加载';
    grid.innerHTML = '<div class="state">暂时无法连接 GitHub，可能是网络或访问次数限制。<br><button class="retry" type="button">重新加载 ↻</button> <a href="https://github.com/FrRay?tab=repositories" target="_blank" rel="noopener noreferrer">前往 GitHub 查看 ↗</a></div>';
    grid.querySelector('.retry').addEventListener('click', loadRepositories);
  }
}
search.addEventListener('input', render); language.addEventListener('change', render); loadRepositories();
