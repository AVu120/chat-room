import React from "react";
import { Link as ExternalLink, Typography } from "@material-ui/core";

const CopyrightMessage = () => {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <ExternalLink
        color="inherit"
        href="https://www.linkedin.com/in/anthony-hien-vu"
        target="_blank"
      >
        Anthony Hien Vu
      </ExternalLink>
      {` ${new Date().getFullYear()}`}
      {"."}
    </Typography>
  );
};

export default CopyrightMessage;
