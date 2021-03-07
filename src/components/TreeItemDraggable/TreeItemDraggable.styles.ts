import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles({
  root: {
    "&[data-dragging=true]": {
      opacity: 0.4
    }
  }
});

export default useStyles;