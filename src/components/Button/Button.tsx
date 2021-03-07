import React from "react";
import ButtonProps from "./ButtonProps";

function Button(props: ButtonProps): JSX.Element {
  const { primary } = props;

  React.useEffect(() => {
    console.log(primary);
  }, [primary]);

  const handleClick = React.useCallback(() => {
    console.log(primary);
  }, [primary]);

  return (
    <button type="button" onClick={handleClick}>
      Button {primary ? "primary" : ""}
    </button>
  );
}

export default Button;
