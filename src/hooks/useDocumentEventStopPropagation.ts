import React from "react";

interface UseStopDocumentPropagationResult {
  startDocumentEventStopPropagation: (types: string[]) => void;
  stopDocumentEventStopPropagation: (types: string[]) => void;
}

function useDocumentEventStopPropagation(): UseStopDocumentPropagationResult {
  const handler = React.useCallback((event: Event) => {
    console.log("stop");
    event.stopPropagation();
  }, []);

  const startDocumentEventStopPropagation = React.useCallback(
    (types: string[]) => {
      types.forEach((type) => {
        document.addEventListener(type, handler, true);
      });
    },
    [handler]
  );

  const stopDocumentEventStopPropagation = React.useCallback(
    (types: string[]) => {
      types.forEach((type) => {
        document.removeEventListener(type, handler, true);
      });
    },
    [handler]
  );

  return {
    startDocumentEventStopPropagation,
    stopDocumentEventStopPropagation,
  };
}

export default useDocumentEventStopPropagation;
