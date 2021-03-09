import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles({
  root: {
    "&[data-dragging=true]": {
      userSelect: "none",
      "& .MuiTreeItem-label:hover": {
        background: "transparent !important"
      }
    },
  }
});

export default useStyles;