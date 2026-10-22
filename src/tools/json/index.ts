import type { Tool } from '../../types';
import { button, copyButton, field, h } from '../../ui';
import { formatJson, minifyJson } from './logic';

const tool: Tool = {
  id: 'json',
  name: 'JSON Formatter',
  description: 'Pretty-print, minify and validate JSON.',
  status: 'ready',
  render(root) {
    const input = h('textarea', { class: 'code', rows: '10', spellcheck: 'false', placeholder: '{"paste": "some JSON"}' });
    const output = h('textarea', { class: 'code', rows: '10', spellcheck: 'false', readonly: '' });
    const indent = h(
      'select',
      {},
      h('option', { value: '2' }, '2 spaces'),
      h('option', { value: '4' }, '4 spaces'),
      h('option', { value: 'tab' }, 'Tabs'),
    );
    const sortKeys = h('input', { type: 'checkbox' });
    const error = h('p', { class: 'error', role: 'alert' });

    const run = (fn: () => string) => {
      try {
        output.value = fn();
        error.textContent = '';
      } catch (e) {
        output.value = '';
        error.textContent = (e as Error).message;
      }
    };
    const options = () => ({
      indent: indent.value === 'tab' ? ('\t' as const) : Number(indent.value),
      sortKeys: sortKeys.checked,
    });

    root.append(
      field('Input', input),
      h(
        'div',
        { class: 'toolbar' },
        button('Format', () => run(() => formatJson(input.value, options()))),
        button('Minify', () => run(() => minifyJson(input.value)), 'ghost'),
        field('Indent', indent),
        h('label', { class: 'check' }, sortKeys, 'Sort keys'),
      ),
      error,
      field('Output', output),
      h('div', { class: 'toolbar' }, copyButton(() => output.value)),
    );
  },
};

export default tool;
