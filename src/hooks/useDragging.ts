import React from "react";

const WAIT_TIME = 300;

interface UseDraggingOptions {
  active: boolean;
  onStart: (
    event: React.MouseEvent | React.TouchEvent | React.KeyboardEvent
  ) => void;
  onMove: (event: MouseEvent | TouchEvent) => void;
  onKey: (event: KeyboardEvent) => void;
  onCancel: (event: MouseEvent | TouchEvent | KeyboardEvent) => void;
  onDrop: (event: MouseEvent | TouchEvent | KeyboardEvent) => void;
  onMouseDown: (event: React.MouseEvent) => void;
  onTouchStart: (event: React.TouchEvent) => void;
  onKeyDown: (event: React.KeyboardEvent) => void;
}

interface UseDraggingResult {
  handleMouseDown: (event: React.MouseEvent) => void;
  handleTouchStart: (event: React.TouchEvent) => void;
  handleKeyDown: (event: React.KeyboardEvent) => void;
}

function useDragging(options: UseDraggingOptions): UseDraggingResult {
  const {
    active,
    onStart,
    onMove,
    onKey,
    onCancel,
    onDrop,
    onMouseDown,
    onTouchStart,
    onKeyDown,
  } = options;

  const timeoutRef = React.useRef<NodeJS.Timeout>();

  const startedRef = React.useRef<boolean>(false);

  const startedKeyDownRef = React.useRef<boolean>(false);

  const handleDocumentClick = React.useCallback((event: Event) => {
    event.stopPropagation();
    document.removeEventListener("click", handleDocumentClick, true);
  }, []);

  const handleDocumentKeyDown = React.useCallback(
    (event: KeyboardEvent) => {
      event.stopPropagation();
      event.preventDefault();

      switch (event.key) {
        case "Escape":
          if (!startedRef.current) {
            return;
          }
          startedRef.current = false;
          onCancel(event);
          document.removeEventListener("keydown", handleDocumentKeyDown, true);
          break;
        case "Enter":
          if (!startedRef.current) {
            return;
          }
          startedRef.current = false;
          onDrop(event);
          document.removeEventListener("keydown", handleDocumentKeyDown, true);
          break;
        default:
          onKey(event);
          break;
      }
    },
    [onCancel, onDrop, onKey]
  );

  const handleDocumentMouseMove = React.useCallback(
    (event: MouseEvent) => {
      if (active) {
        clearTimeout(timeoutRef.current);
        if (startedRef.current) {
          onMove(event);
        }
      }
    },
    [active, onMove]
  );

  const handleDocumentMouseUp = React.useCallback(
    (event: MouseEvent) => {
      if (active) {
        clearTimeout(timeoutRef.current);
        if (startedRef.current) {
          onDrop(event);
        }
        startedRef.current = false;
        document.removeEventListener("mousemove", handleDocumentMouseMove);
        document.removeEventListener("mouseup", handleDocumentMouseUp);
        document.removeEventListener("keydown", handleDocumentKeyDown, true);
      }
    },
    [active, handleDocumentKeyDown, handleDocumentMouseMove, onDrop]
  );

  const handleMouseDown = React.useCallback(
    (event: React.MouseEvent) => {
      if (active) {
        event.stopPropagation();
        document.addEventListener("mousemove", handleDocumentMouseMove);
        document.addEventListener("mouseup", handleDocumentMouseUp);
        document.addEventListener("keydown", handleDocumentKeyDown, true);
        timeoutRef.current = setTimeout(() => {
          startedRef.current = true;
          document.addEventListener("click", handleDocumentClick, true);
          onStart(event);
        }, WAIT_TIME);
      }
      if (onMouseDown) {
        onMouseDown(event);
      }
    },
    [
      active,
      onMouseDown,
      handleDocumentMouseMove,
      handleDocumentMouseUp,
      handleDocumentKeyDown,
      handleDocumentClick,
      onStart,
    ]
  );

  const handleDocumentTouchMove = React.useCallback(
    (event: TouchEvent) => {
      if (active) {
        clearTimeout(timeoutRef.current);
        if (startedRef.current) {
          onMove(event);
        }
      }
    },
    [active, onMove]
  );

  const handleDocumentTouchEnd = React.useCallback(
    (event: TouchEvent) => {
      if (active) {
        clearTimeout(timeoutRef.current);
        if (startedRef.current) {
          onDrop(event);
        }
        startedRef.current = false;
        document.removeEventListener("touchmove", handleDocumentTouchMove);
        document.removeEventListener("touchend", handleDocumentTouchEnd);
      }
    },
    [active, handleDocumentTouchMove, onDrop]
  );

  const handleTouchStart = React.useCallback(
    (event: React.TouchEvent) => {
      if (active) {
        event.stopPropagation();
        document.addEventListener("touchmove", handleDocumentTouchMove);
        document.addEventListener("touchend", handleDocumentTouchEnd);
        timeoutRef.current = setTimeout(() => {
          startedRef.current = true;
          onStart(event);
        }, WAIT_TIME);
      }
      if (onTouchStart) {
        onTouchStart(event);
      }
    },
    [
      active,
      handleDocumentTouchMove,
      handleDocumentTouchEnd,
      onStart,
      onTouchStart,
    ]
  );

  const handleDocumentKeyUp = React.useCallback(() => {
    if (active) {
      clearTimeout(timeoutRef.current);
      startedKeyDownRef.current = false;
      document.removeEventListener("keyup", handleDocumentKeyUp);
    }
  }, [active]);

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent) => {
      if (active) {
        switch (event.key) {
          case " ":
            if (startedRef.current || startedKeyDownRef.current) {
              return;
            }
            startedKeyDownRef.current = true;
            document.addEventListener("keyup", handleDocumentKeyUp);
            timeoutRef.current = setTimeout(() => {
              startedRef.current = true;
              onStart(event);
              document.addEventListener("keydown", handleDocumentKeyDown, true);
            }, WAIT_TIME);
            break;
        }
      }
      if (onKeyDown) {
        onKeyDown(event);
      }
    },
    [active, onKeyDown, handleDocumentKeyUp, handleDocumentKeyDown, onStart]
  );

  React.useEffect(() => {
    document.removeEventListener("click", handleDocumentClick, true);
    document.removeEventListener("keydown", handleDocumentKeyDown, true);
    document.removeEventListener("mousemove", handleDocumentMouseMove);
    document.removeEventListener("mouseup", handleDocumentMouseUp);
    document.addEventListener("touchmove", handleDocumentTouchMove);
    document.addEventListener("touchend", handleDocumentTouchEnd);
    document.removeEventListener("keyup", handleDocumentKeyUp);
  }, [
    handleDocumentClick,
    handleDocumentMouseMove,
    handleDocumentMouseUp,
    handleDocumentTouchEnd,
    handleDocumentTouchMove,
    handleDocumentKeyUp,
    handleDocumentKeyDown,
  ]);
  return {
    handleMouseDown,
    handleTouchStart,
    handleKeyDown,
  };
}

export default useDragging;
