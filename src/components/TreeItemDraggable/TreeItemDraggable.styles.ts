import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  root: {
    "&[data-dragging=true]": {
      opacity: 0.4
    },
    "&.drop": {
      "& > .MuiTreeItem-content": {
        position: "relative",
        "&::before": {
          content: "''",
          position: "absolute",
          right: 0,
          height: 1,
          background: theme.palette.primary.main
        },
        "&::after": {
          content: "''",
          position: "absolute",
          width: 6,
          height: 6,
          borderRadius: 999,
          border: `1px solid ${theme.palette.primary.main}`,
          background: theme.palette.common.white
        }
      }
    },
    "&.before": {
      "& > .MuiTreeItem-content": {
        "&::before": {
          top: 0,
          left: 0
        },
        "&::after": {
          top: -3,
          left: -3
        }
      }
    },
    "&.after": {
      "& > .MuiTreeItem-content": {
        "&::before": {
          bottom: 0,
          left: 0
        },
        "&::after": {
          bottom: -3,
          left: -3
        }
      }
    },
    "&.inside": {
      "& > .MuiTreeItem-content": {
        "&::before": {
          bottom: 0,
          left: 17
        },
        "&::after": {
          bottom: -3,
          left: 14
        }
      }
    }

  }
}));

export default useStyles;