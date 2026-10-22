import type { Tool } from '../../types';
import { button, copyButton, field, h } from '../../ui';
import { decode, encode } from './logic';

const tool: Tool = {
  id: 'base64',
  name: 'Base64',
  description: 'Encode and decode Base64, including the URL-safe variant.',
  status: 'ready',
  render(root) {
    const input = h('textarea', { class: 'code', rows: '6', spellcheck: 'false', placeholder: 'Text or Base64' });
    const output = h('textarea', { class: 'code', rows: '6', spellcheck: 'false', readonly: '' });
    const urlSafe = h('input', { type: 'checkbox' });
    const error = h('p', { class: 'error', role: 'alert' });

    const run = (fn: () => string) => {
      try {
        output.value = fn();
        error.textContent = '';
      } catch {
        output.value = '';
        error.textContent = 'Could not convert input.';
      }
    };

    root.append(
      field('Input', input),
      h(
        'div',
        { class: 'toolbar' },
        button('Encode', () => run(() => encode(input.value, urlSafe.checked))),
        button('Decode', () => run(() => decode(input.value)), 'ghost'),
        h('label', { class: 'check' }, urlSafe, 'URL-safe'),
      ),
      error,
      field('Output', output),
      h('div', { class: 'toolbar' }, copyButton(() => output.value)),
    );
  },
};

export default tool;
