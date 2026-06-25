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
    el.textContent = "";
    el.setAttribute("aria-label", text);

    for (const ch of text) {
      if (ch === " ") {
        const space = document.createElement("span");
        space.textContent = "\u00A0";
        space.style.display = "inline-block";
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
