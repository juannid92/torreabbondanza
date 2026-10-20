/**
 * Lightweight SplitText shim (per-character) — evita la dipendenza dal plugin
 * GSAP a pagamento. Sufficiente per mask-reveal lettera-per-lettera.
 */
export class SplitText {
  chars: HTMLSpanElement[] = [];
  private original: string;
  private el: HTMLElement;

  constructor(el: HTMLElement, _opts: { type: "chars" }) {
    this.el = el;
    this.original = el.textContent ?? "";
    const text = this.original;
    const isHidden =
      el.getAttribute("aria-hidden") === "true" || Boolean(el.closest('[aria-hidden="true"]'));
    el.textContent = "";

    if (!isHidden && text.trim()) {
      const sr = document.createElement("span");
      sr.className = "sr-only";
      sr.textContent = text;
      el.appendChild(sr);
    }

    for (const ch of text) {
      if (ch === " ") {
        const space = document.createElement("span");
        space.textContent = "\u00A0";
        space.style.display = "inline-block";
        space.setAttribute("aria-hidden", "true");
        el.appendChild(space);
        continue;
      }
      const wrap = document.createElement("span");
      wrap.style.display = "inline-block";
      wrap.style.overflow = "hidden";
      wrap.style.verticalAlign = "top";
      wrap.setAttribute("aria-hidden", "true");
      const inner = document.createElement("span");
      inner.style.display = "inline-block";
      inner.style.willChange = "transform";
      inner.textContent = ch;
      wrap.appendChild(inner);
      el.appendChild(wrap);
      this.chars.push(inner);
    }
  }

  revert() {
    this.el.textContent = this.original;
    this.chars = [];
  }
}

/**
 * Split per-parola: avvolge ogni parola in uno <span> inline-block per consentire
 * mask-reveal con `overflow: hidden` sul contenitore, preservando eventuali tag
 * inline figli (es. `<em class="text-terracotta">`).
 */
export function splitWords(el: HTMLElement): HTMLSpanElement[] {
  const text = el.textContent ?? "";
  const isHidden =
    el.getAttribute("aria-hidden") === "true" || Boolean(el.closest('[aria-hidden="true"]'));
  const childNodes = Array.from(el.childNodes);
  el.textContent = "";

  if (!isHidden && text.trim()) {
    const sr = document.createElement("span");
    sr.className = "sr-only";
    sr.textContent = text;
    el.appendChild(sr);
  }

  const words: HTMLSpanElement[] = [];

  const appendTokens = (rawText: string, wrapperTemplate?: HTMLElement) => {
    const tokens = rawText.split(/(\s+)/);
    for (const token of tokens) {
      if (token === "") continue;
      if (/^\s+$/.test(token)) {
        el.appendChild(document.createTextNode(" "));
        continue;
      }
      const span = document.createElement("span");
      span.textContent = token;
      span.style.display = "inline-block";
      span.style.willChange = "transform";
      span.setAttribute("aria-hidden", "true");

      if (wrapperTemplate) {
        const wrapper = wrapperTemplate.cloneNode(false) as HTMLElement;
        wrapper.setAttribute("aria-hidden", "true");
        wrapper.appendChild(span);
        el.appendChild(wrapper);
      } else {
        el.appendChild(span);
      }
      words.push(span);
    }
  };

  for (const node of childNodes) {
    if (node.nodeType === Node.TEXT_NODE) {
      appendTokens(node.textContent ?? "");
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const childEl = node as HTMLElement;
      if (childEl.classList.contains("sr-only")) continue;
      appendTokens(childEl.textContent ?? "", childEl);
    }
  }

  return words;
}
