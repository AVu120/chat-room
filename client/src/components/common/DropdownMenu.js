import React from "react";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import Typography from "@material-ui/core/Typography";
import { IconButton } from "@material-ui/core";

export default function DropdownMenu({
  menuIcon,
  iconOptions,
  textOptions,
  onClickOptions,
}) {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const onOpen = (event) => {
    // Opens menu + positions it directly underneath the button.
    setAnchorEl(event.currentTarget);
  };

  const onClose = () => {
    setAnchorEl(null);
  };

  return (
    <div style={{ marginLeft: "20px" }}>
      {/* <Button onClick={onOpen}>Open Menu</Button> */}
      <IconButton size="small" onClick={onOpen}>
        {menuIcon}
      </IconButton>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        // onClose callback is triggered onTabPress, onEscPress & onBackgroundClick.
        onClose={onClose}
      >
        {textOptions.map((textOption, i) => (
          <MenuItem
            onClick={() => {
              setAnchorEl(null);
              onClickOptions[i]();
            }}
            key={`${textOption} menu option`}
          >
            <ListItemIcon style={{ marginRight: "-20px" }}>
              {iconOptions[i]}
            </ListItemIcon>
            <Typography variant="inherit">{textOption}</Typography>
          </MenuItem>
        ))}
        {/* <MenuItem onClick={onClose}>Profile</MenuItem>
        <MenuItem onClick={onClose}>My account</MenuItem>
        <MenuItem onClick={onClose}>Logout</MenuItem> */}
      </Menu>
    </div>
  );
}
