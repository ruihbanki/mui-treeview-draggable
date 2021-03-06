export function getScrollContaneir(el: Element): Element | null {
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

export function getEventClientPosition(
  event: MouseEvent | TouchEvent
): { clientX: number; clientY: number } {
  let clientX: number;
  let clientY: number;
  if ("clientX" in event && "clientY" in event) {
    clientX = (event as MouseEvent).clientX;
    clientY = (event as MouseEvent).clientY;
  } else {
    clientX = (event as TouchEvent).touches[0].clientX;
    clientY = (event as TouchEvent).touches[0].clientY;
  }

  return { clientX, clientY };
}
