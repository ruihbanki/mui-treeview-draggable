export function getScrollContaneir(el: Element): Element {
  let current = el;
  while (current) {
    if (hasScrollbar(current)) {
      return current;
    }
    current = current.parentElement;
  }
  return null;
}

function hasScrollbar(el: Element) {
  return el.scrollHeight > el.clientHeight || el.scrollWidth > el.clientWidth;
}

export function getClientPosition(event: MouseEvent | TouchEvent): { clientX: number, clientY:number } {
  let clientX: number;
  let clientY: number;
  if (event.type === "mousemove") {
    clientX = (event as MouseEvent).clientX;
    clientY = (event as MouseEvent).clientY;
  } else {
    clientX = (event as TouchEvent).touches[0].clientX;
    clientY = (event as TouchEvent).touches[0].clientY;
  }

  return {clientX, clientY };
}