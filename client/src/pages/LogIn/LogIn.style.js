import { makeStyles } from "@material-ui/core/styles";
import ExternalLink from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";

export const Copyright = () => {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <ExternalLink
        color="inherit"
        href="https://www.linkedin.com/in/anthony-hien-vu"
      >
        Anthony Hien Vu
      </ExternalLink>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
};

export const useStyles = makeStyles((theme) => ({
  paper: {
    justifyContent: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  primarySubmit: {
    margin: theme.spacing(1, 0, 1),
  },
  secondarySubmit: {
    margin: theme.spacing(1, 0, 1),
  },
  loadingIcon: {
    display: "flex",
    justifyContent: "center",
    margin: "10px 0",
  },
}));
