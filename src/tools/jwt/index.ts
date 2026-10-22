import type { Tool } from '../../types';
import { copyButton, field, h } from '../../ui';
import { decodeJwt } from './logic';

const CLAIM_LABELS = { exp: 'Expires (exp)', iat: 'Issued at (iat)', nbf: 'Not before (nbf)' };

const tool: Tool = {
  id: 'jwt',
  name: 'JWT Decoder',
  description: 'Decode a JSON Web Token and inspect its header, payload and expiry.',
  status: 'ready',
  render(root) {
    const input = h('textarea', { class: 'code', rows: '5', spellcheck: 'false', placeholder: 'eyJhbGciOi...' });
    const error = h('p', { class: 'error', role: 'alert' });
    const header = h('textarea', { class: 'code', rows: '5', spellcheck: 'false', readonly: '' });
    const payload = h('textarea', { class: 'code', rows: '10', spellcheck: 'false', readonly: '' });
    const results = h('tbody');
    const table = h('table', { class: 'results', hidden: '' }, results);

    const update = () => {
      header.value = '';
      payload.value = '';
      results.replaceChildren();
      table.hidden = true;
      error.textContent = '';
      if (!input.value.trim()) return;

      try {
        const decoded = decodeJwt(input.value);
        header.value = JSON.stringify(decoded.header, null, 2);
        payload.value = JSON.stringify(decoded.payload, null, 2);
        results.append(
          ...decoded.times.map(({ claim, date }) =>
            h('tr', {}, h('th', {}, CLAIM_LABELS[claim]), h('td', {}, `${date.toISOString()} (${date.toLocaleString()})`)),
          ),
        );
        if (decoded.times.some((t) => t.claim === 'exp')) {
          const status = decoded.expired
            ? h('td', { class: 'fail' }, 'Expired')
            : h('td', { class: 'pass' }, 'Not expired');
          results.append(h('tr', {}, h('th', {}, 'Status'), status));
        }
        table.hidden = results.childElementCount === 0;
      } catch (e) {
        error.textContent = e instanceof Error ? e.message : 'Could not decode token.';
      }
    };

    input.addEventListener('input', update);

    root.append(
      field('Token', input),
      h('p', { class: 'muted' }, 'Decode only: the signature is not verified.'),
      error,
      table,
      field('Header', header),
      h('div', { class: 'toolbar' }, copyButton(() => header.value, 'Copy header')),
      field('Payload', payload),
      h('div', { class: 'toolbar' }, copyButton(() => payload.value, 'Copy payload')),
    );
  },
};

export default tool;
