import './style.css';
import { findTool, tools } from './registry';
import type { Tool } from './types';
import { h } from './ui';

const app = document.querySelector<HTMLDivElement>('#app')!;
const nav = h('nav', { class: 'sidebar' });
const main = h('main', { class: 'content' });
app.append(nav, main);

function renderNav(activeId?: string) {
  nav.replaceChildren(
    h('a', { href: '#/', class: 'brand' }, 'Toolbox'),
    h(
      'ul',
      {},
      ...tools.map((tool) => {
        const classes = ['nav-item', tool.status, tool.id === activeId ? 'active' : ''].join(' ').trim();
        return h('li', {}, h('a', { href: `#/${tool.id}`, class: classes }, tool.name));
      }),
    ),
  );
}

function card(tool: Tool) {
  const badge = tool.status === 'planned' ? h('span', { class: 'badge' }, 'Coming soon') : '';
  return h(
    'a',
    { href: `#/${tool.id}`, class: `card ${tool.status}` },
    h('h2', {}, tool.name, badge),
    h('p', {}, tool.description),
  );
}

function renderHome() {
  main.replaceChildren(
    h(
      'header',
      { class: 'page-header' },
      h('h1', {}, 'Toolbox'),
      h('p', { class: 'muted' }, 'Small, offline utilities for everyday dev work.'),
    ),
    h('div', { class: 'grid' }, ...tools.map(card)),
  );
}

function renderTool(tool: Tool) {
  const body = h('section', { class: 'tool-body' });
  main.replaceChildren(
    h('header', { class: 'page-header' }, h('h1', {}, tool.name), h('p', { class: 'muted' }, tool.description)),
    body,
  );
  if (tool.render) {
    tool.render(body);
  } else {
    body.append(
      h(
        'div',
        { class: 'placeholder' },
        h('p', {}, 'This tool hasn’t been built yet.'),
        h('p', { class: 'muted' }, `Implement it in src/tools/${tool.id}/`),
      ),
    );
  }
}

function route() {
  const id = location.hash.replace(/^#\/?/, '');
  const tool = id ? findTool(id) : undefined;
  renderNav(tool?.id);
  if (tool) renderTool(tool);
  else renderHome();
}

window.addEventListener('hashchange', route);
renderNav();
renderHome();
