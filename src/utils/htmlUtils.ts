export function getScrollContaneir(el: HTMLElement): HTMLElement {
  let current = el;
  while (current) {
    if (hasScrollbar(current)) {
      return current;
    }
    current = current.parentElement;
  }
  return null;
}

function hasScrollbar(el: HTMLElement) {
  return el.scrollHeight > el.clientHeight || el.scrollWidth > el.clientWidth;
}