type Child = Node | string;

/** Tiny element helper: h('div', { class: 'x' }, 'text', otherNode) */
export function h<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  attrs: Record<string, string> = {},
  ...children: Child[]
): HTMLElementTagNameMap[K] {
  const el = document.createElement(tag);
  for (const [key, value] of Object.entries(attrs)) el.setAttribute(key, value);
  el.append(...children);
  return el;
}

/** A labelled form control. */
export function field(label: string, control: HTMLElement): HTMLLabelElement {
  return h('label', { class: 'field' }, h('span', { class: 'field-label' }, label), control);
}

export function button(label: string, onClick: () => void, variant: 'primary' | 'ghost' = 'primary'): HTMLButtonElement {
  const btn = h('button', { type: 'button', class: `btn btn-${variant}` }, label);
  btn.addEventListener('click', onClick);
  return btn;
}

export function copyButton(getText: () => string, label = 'Copy'): HTMLButtonElement {
  const btn = button(
    label,
    async () => {
      await navigator.clipboard.writeText(getText());
      btn.textContent = 'Copied';
      setTimeout(() => (btn.textContent = label), 1200);
    },
    'ghost',
  );
  return btn;
}
