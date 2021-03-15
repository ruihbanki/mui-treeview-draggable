import { makeStyles } from "@material-ui/core";


const useStyles = makeStyles((theme) => ({
  root: {
    "&[data-dragging=true]": {
      opacity: 0.4,
      outline: "1px dashed #aaa",
    },
    "&.drop": {
      position: "relative",
      "& > .MuiTreeItem-content": {
        position: "relative",
        background: "#eee",
      },
    },
    "&.before": {
      "&::before": {
        content: "''",
        position: "absolute",
        right: 0,
        height: 1,
        background: theme.palette.primary.main,
        zIndex: 1,
        top: 0,
        left: 0,
      },
      "&::after": {
        content: "''",
        position: "absolute",
        width: 6,
        height: 6,
        borderRadius: 999,
        border: `1px solid ${theme.palette.primary.main}`,
        background: theme.palette.common.white,
        zIndex: 1,
        top: -3,
        left: -3,
      },
    },
    "&.after": {
      "&::before": {
        content: "''",
        position: "absolute",
        right: 0,
        height: 1,
        background: theme.palette.primary.main,
        zIndex: 1,
        bottom: 0,
        left: 0,
      },
      "&::after": {
        content: "''",
        position: "absolute",
        width: 6,
        height: 6,
        borderRadius: 999,
        border: `1px solid ${theme.palette.primary.main}`,
        background: theme.palette.common.white,
        zIndex: 1,
        bottom: -3,
        left: -3,
      },
    },
    "&.inside": {
      "& > .MuiTreeItem-content": {
        "&::before": {
          content: "''",
          position: "absolute",
          right: 0,
          height: 1,
          background: theme.palette.primary.main,
          zIndex: 1,
          bottom: 0,
          left: 17,
        },
        "&::after": {
          content: "''",
          position: "absolute",
          width: 6,
          height: 6,
          borderRadius: 999,
          border: `1px solid ${theme.palette.primary.main}`,
          background: theme.palette.common.white,
          zIndex: 1,
          bottom: -3,
          left: 14,
        },
      }
    },
  },
}));

export default useStyles;
