import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles({
  root: {
    "&[data-dragging=true]": {
      color: "red",
      userSelect: "none"
    }
  }
});

export default useStyles;