import type { Tool } from '../../types';
import { copyButton, field, h } from '../../ui';
import { contrastRatio, parseColor, rgbToHsl, toHex, type RGB } from './logic';

const WHITE: RGB = { r: 255, g: 255, b: 255 };
const BLACK: RGB = { r: 0, g: 0, b: 0 };

const tool: Tool = {
  id: 'color',
  name: 'Color Converter',
  description: 'Convert between hex, RGB and HSL, and check contrast.',
  status: 'ready',
  render(root) {
    const input = h('input', { type: 'text', class: 'code', value: '#3b5bdb', spellcheck: 'false' });
    const picker = h('input', { type: 'color', value: '#3b5bdb' });
    const swatch = h('div', { class: 'swatch' });
    const results = h('tbody');
    const error = h('p', { class: 'error', role: 'alert' });

    const contrastCell = (rgb: RGB, against: RGB) => {
      const ratio = contrastRatio(rgb, against);
      const passes = ratio >= 4.5;
      return h('td', {}, `${ratio.toFixed(2)} : 1 `, h('span', { class: passes ? 'pass' : 'fail' }, passes ? 'AA ✓' : 'AA ✗'));
    };

    const update = () => {
      const rgb = parseColor(input.value);
      results.replaceChildren();
      if (!rgb) {
        error.textContent = 'Unrecognised colour.';
        return;
      }
      error.textContent = '';
      const hex = toHex(rgb);
      const { h: hue, s, l } = rgbToHsl(rgb);
      swatch.style.background = hex;
      picker.value = hex;

      const formats: [string, string][] = [
        ['Hex', hex],
        ['RGB', `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`],
        ['HSL', `hsl(${hue}, ${s}%, ${l}%)`],
      ];
      results.append(
        ...formats.map(([label, value]) =>
          h('tr', {}, h('th', {}, label), h('td', {}, value, ' ', copyButton(() => value))),
        ),
        h('tr', {}, h('th', {}, 'Contrast vs white'), contrastCell(rgb, WHITE)),
        h('tr', {}, h('th', {}, 'Contrast vs black'), contrastCell(rgb, BLACK)),
      );
    };

    input.addEventListener('input', update);
    picker.addEventListener('input', () => {
      input.value = picker.value;
      update();
    });

    root.append(
      h('div', { class: 'toolbar' }, field('Colour', input), field('Picker', picker)),
      error,
      swatch,
      h('table', { class: 'results' }, results),
    );
    update();
  },
};

export default tool;
