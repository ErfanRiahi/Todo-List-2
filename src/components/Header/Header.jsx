import { Logout, Person, Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Alert,
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  ListItemIcon,
  Menu,
  MenuItem,
  OutlinedInput,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { useContext, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { getAllMember } from "../../API/API";
import { AppContexts } from "../../contexts/AppContexts";
import "./style.css";

export const Header = () => {
  const { user, setUser } = useContext(AppContexts);
  const [usernamePassword, setUsernamePassword] = useState({
    username: "",
    password: "",
  });

  // ******************** Login dialog ******************** //
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setUsernamePassword({ ...usernamePassword, username: "", password: "" });
  };

  const [allMembers, setAllMembers] = useState();

  // ******************** Snackbar ******************** //
  const [snackBarState, setSnackBarState] = useState({
    openSnackbar: false,
  });
  const { openSnackbar } = snackBarState;
  const handleClick = () => {
    setSnackBarState({ openSnackbar: true });
  };
  const handleCloseSnackbar = () => {
    setSnackBarState({ openSnackbar: false });
  };

  // ******************** password textField ******************** //
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  // ******************** Profile Menu ******************** //
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);
  const handleClickProfile = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseProfile = () => {
    setAnchorEl(null);
  };

  function logout() {
    setUser({
      username: "",
      password: "",
      profileImage: "",
      isAdmin: false,
      login: false,
    });
    handleClose();
    handleCloseSnackbar();
  }
  useEffect(() => {
    getAllMember().then((data) => setAllMembers(data.data));
  }, []);

  function checkLogin() {
    allMembers
      ? allMembers.map((member) => {
          if (member.github === usernamePassword.username) {
            console.log("ok");
            if (member.password === usernamePassword.password) {
              console.log(member);
              setUser({
                ...user,
                username: usernamePassword.username,
                password: usernamePassword.password,
                login: true,
                profileImage: member.profileImage,
                isAdmin: member.isAdmin,
              });
            }
          } else handleClick();
        })
      : console.log("not found");
  }

  return (
    <header>
      <nav>
        <ul>
          <li className="item">
            <NavLink
              to={"/"}
              style={({ isActive }) =>
                isActive ? { color: "brown" } : undefined
              }
            >
              Home
            </NavLink>
          </li>
          <li className="item">
            <NavLink
              to={"/history"}
              style={({ isActive }) =>
                isActive ? { color: "brown" } : undefined
              }
            >
              History
            </NavLink>
          </li>
          <li className="item">
            <NavLink
              to={"/members"}
              style={({ isActive }) =>
                isActive ? { color: "brown" } : undefined
              }
            >
              Members
            </NavLink>
          </li>
        </ul>
        {user.login ? (
          <>
            <Box sx={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <Typography sx={{ fontWeight: "bold", marginTop: "3px" }}>
                {user.username}
              </Typography>
              <IconButton
                onClick={handleClickProfile}
                size="small"
                aria-controls={openMenu ? "account-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={openMenu ? "true" : undefined}
                sx={{ marginRight: "20px" }}
              >
                {user.profileImage ? (
                  <Avatar alt="profileImage" src={user.profileImage} />
                ) : (
                  <Person
                    sx={{
                      fontSize: "1.8rem",
                      marginRight: "20px",
                      alignItems: "center",
                    }}
                  />
                )}
              </IconButton>
            </Box>
            <Menu
              anchorEl={anchorEl}
              id="account-menu"
              open={openMenu}
              onClose={handleCloseProfile}
              onClick={handleCloseProfile}
              PaperProps={{
                elevation: 0,
                sx: {
                  overflow: "visible",
                  filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                  mt: 1.5,
                  "& .MuiAvatar-root": {
                    width: 32,
                    height: 32,
                    ml: -0.5,
                    mr: 1,
                  },
                },
              }}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
              <MenuItem onClick={handleCloseProfile}>
                <Avatar /> Profile
              </MenuItem>

              <Divider />

              <MenuItem onClick={logout}>
                <ListItemIcon>
                  <Logout fontSize="small" />
                </ListItemIcon>
                Logout
              </MenuItem>
            </Menu>
          </>
        ) : (
          <>
            <Button
              sx={{
                padding: "0",
                lineHeight: "0",
                fontWeight: "900",
                marginRight: "20px",
              }}
              onClick={handleOpen}
            >
              Login
            </Button>
            <Dialog open={open} onClose={handleClose}>
              <DialogTitle textAlign="center" sx={{ paddingBottom: "0" }}>
                Login
              </DialogTitle>
              <DialogContent sx={{ display: "grid", gap: "20px" }}>
                <TextField
                  label="Username"
                  sx={{ marginTop: "20px" }}
                  onBlur={(e) =>
                    setUsernamePassword({
                      ...usernamePassword,
                      username: e.target.value,
                    })
                  }
                />

                <FormControl>
                  <InputLabel htmlFor="outlined-adornment-password">
                    Password
                  </InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-password"
                    type={showPassword ? "text" : "password"}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                          sx={{ marginLeft: "-30px" }}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                    label="Password"
                    onBlur={(e) =>
                      setUsernamePassword({
                        ...usernamePassword,
                        password: e.target.value,
                      })
                    }
                  />
                </FormControl>

                <Typography>Admin username and password</Typography>
                <Typography textAlign="center">ErfanRiahi - 127317</Typography>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={checkLogin}>Ok</Button>
              </DialogActions>
              <Snackbar
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
                open={openSnackbar}
                onClose={handleCloseSnackbar}
                autoHideDuration={4000}

                // message="Please check fields and try again"
              >
                <Alert
                  onClose={handleCloseSnackbar}
                  severity="error"
                  variant="filled"
                >
                  username or password is wrong
                </Alert>
              </Snackbar>
            </Dialog>
          </>
        )}
      </nav>
    </header>
  );
};
