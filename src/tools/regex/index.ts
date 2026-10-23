import type { Tool } from '../../types';
import { copyButton, field, h } from '../../ui';
import { SUPPORTED_FLAGS, formatMatches, segmentText, testRegex, type RegexMatch } from './logic';

const tool: Tool = {
  id: 'regex',
  name: 'Regex Tester',
  description: 'Test regular expressions against sample text with live match highlighting.',
  status: 'ready',
  render(root) {
    const pattern = h('input', { type: 'text', class: 'code', placeholder: '(?<word>\\w+)', spellcheck: 'false' });
    const flagBoxes = SUPPORTED_FLAGS.map((flag) => {
      const box = h('input', { type: 'checkbox', value: flag });
      if (flag === 'g') box.checked = true;
      return box;
    });
    const text = h('textarea', { class: 'code', rows: '8', spellcheck: 'false', placeholder: 'Text to test against' });
    const error = h('p', { class: 'error', role: 'alert' });
    const summary = h('p', { class: 'muted' });
    const preview = h('pre', {
      style:
        'margin: 0; padding: 8px 10px; min-height: 2.5em; white-space: pre-wrap; word-break: break-word; ' +
        'font-family: var(--mono); font-size: 0.88rem; background: var(--surface); border: 1px solid var(--border); border-radius: 6px;',
    });
    const results = h('tbody');
    let matches: RegexMatch[] = [];

    const update = () => {
      const flags = flagBoxes.filter((b) => b.checked).map((b) => b.value).join('');
      const result = pattern.value ? testRegex(pattern.value, flags, text.value) : null;
      matches = result?.ok ? result.matches : [];
      error.textContent = result && !result.ok ? result.error : '';
      summary.textContent = result?.ok
        ? `${matches.length}${result.truncated ? '+' : ''} match${matches.length === 1 ? '' : 'es'}`
        : '';

      preview.replaceChildren(
        ...segmentText(text.value, matches).map((s) => (s.match ? h('mark', {}, s.text) : s.text)),
      );
      results.replaceChildren(
        ...matches.map((m, i) => {
          const groups = [
            ...m.groups.map((g, n) => `$${n + 1}: ${g ?? '(undefined)'}`),
            ...Object.entries(m.namedGroups).map(([name, g]) => `<${name}>: ${g ?? '(undefined)'}`),
          ];
          return h(
            'tr',
            {},
            h('th', {}, `#${i + 1} @ ${m.index}`),
            h('td', {}, JSON.stringify(m.text), ...groups.flatMap((g) => [h('br'), g])),
          );
        }),
      );
    };

    pattern.addEventListener('input', update);
    text.addEventListener('input', update);
    for (const box of flagBoxes) box.addEventListener('change', update);

    root.append(
      h(
        'div',
        { class: 'toolbar' },
        field('Pattern', pattern),
        ...flagBoxes.map((box) => h('label', { class: 'check' }, box, box.value)),
      ),
      error,
      field('Test text', text),
      field('Highlighted', preview),
      h('div', { class: 'toolbar' }, summary, copyButton(() => formatMatches(matches), 'Copy matches')),
      h('table', { class: 'results' }, results),
    );
  },
};

export default tool;
