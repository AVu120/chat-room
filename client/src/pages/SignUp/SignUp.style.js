import { makeStyles } from "@material-ui/core";
export const useStyles = makeStyles((theme) => ({
  paper: {
    // marginTop: theme.spacing(8),
    // height: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  loadingIcon: {
    display: "flex",
    justifyContent: "center",
  },
}));
