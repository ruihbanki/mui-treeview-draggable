import React from "react";

interface Result {
  startScrollOnMove: (el: Element) => void;
  endScrollOnMove: () => void;
}

function useScrollOnMove(): Result {
  const containerRef = React.useRef(null);

  const timeoutRef = React.useRef(null);

  const pointerRef = React.useRef(null);

  const handlePointerMove = React.useCallback((event) => {
    event.preventDefault();
    pointerRef.current = {
      y: event.clientY,
      x: event.clientX,
    };
  }, []);

  const handleTouchMove = React.useCallback((event) => {
    event.preventDefault();
  }, []);

  const scrollContainer = React.useCallback(() => {
    if (!pointerRef.current) {
      return;
    }

    const { y } = pointerRef.current;
    const clientHeight = containerRef.current.clientHeight;

    let rect = containerRef.current.getBoundingClientRect();
    if (containerRef.current.nodeName === "HTML") {
      rect = {
        top: 0,
        bottom: clientHeight,
      };
    }

    const limit = clientHeight > 160 ? 80 : clientHeight / 2;
    const topDist = y - rect.top;
    const bottomDist = rect.bottom - y;

    if (topDist > 0 && topDist < limit) {
      const delta = (limit - topDist) * 0.8;
      containerRef.current.scrollTop -= delta;
    }
    if (bottomDist > 0 && bottomDist < limit) {
      const delta = (limit - bottomDist) * 0.8;
      containerRef.current.scrollTop += delta;
    }
  }, []);

  const startScrollOnMove = React.useCallback(
    (el: Element) => {
      containerRef.current = el;
      containerRef.current.addEventListener("pointermove", handlePointerMove);
      containerRef.current.addEventListener("touchmove", handleTouchMove, {
        passive: false,
      });
      timeoutRef.current = setInterval(() => {
        scrollContainer();
      }, 100);
    },
    [handlePointerMove, handleTouchMove, scrollContainer]
  );

  const endScrollOnMove = React.useCallback(() => {
    if (!containerRef.current) {
      return;
    }
    containerRef.current.removeEventListener("pointermove", handlePointerMove);
    containerRef.current.removeEventListener("touchmove", handleTouchMove);
    clearInterval(timeoutRef.current);
  }, [handlePointerMove, handleTouchMove]);
  React.useEffect(() => {
    return endScrollOnMove;
  }, [endScrollOnMove]);

  return {
    startScrollOnMove,
    endScrollOnMove,
  };
}

export default useScrollOnMove;
