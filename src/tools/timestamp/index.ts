import type { Tool } from '../../types';
import { button, field, h } from '../../ui';
import { parseTimestamp, relativeTime } from './logic';

const tool: Tool = {
  id: 'timestamp',
  name: 'Unix Timestamp',
  description: 'Convert Unix timestamps (seconds or milliseconds) to human-readable dates.',
  status: 'ready',
  render(root) {
    const input = h('input', { type: 'text', class: 'code', placeholder: '1700000000', spellcheck: 'false' });
    const results = h('tbody');
    const error = h('p', { class: 'error', role: 'alert' });

    const update = () => {
      results.replaceChildren();
      error.textContent = '';
      if (!input.value.trim()) return;

      const parsed = parseTimestamp(input.value);
      if (!parsed) {
        error.textContent = 'Not a valid timestamp.';
        return;
      }
      const { date, unit } = parsed;
      const rows: [string, string][] = [
        ['Detected unit', unit],
        ['ISO 8601', date.toISOString()],
        ['UTC', date.toUTCString()],
        ['Local', date.toLocaleString()],
        ['Relative', relativeTime(date)],
        ['Seconds', String(Math.floor(date.getTime() / 1000))],
        ['Milliseconds', String(date.getTime())],
      ];
      results.append(...rows.map(([label, value]) => h('tr', {}, h('th', {}, label), h('td', {}, value))));
    };

    input.addEventListener('input', update);

    root.append(
      h(
        'div',
        { class: 'toolbar' },
        field('Timestamp', input),
        button(
          'Now',
          () => {
            input.value = String(Date.now());
            update();
          },
          'ghost',
        ),
      ),
      error,
      h('table', { class: 'results' }, results),
    );
  },
};

export default tool;
