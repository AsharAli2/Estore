import * as React from "react";
import Badge from "@mui/material/Badge";
import { styled } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import cartcontext from "../../context/Cartcontext";
import { useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { deepOrange } from "@mui/material/colors";
import { Divider, Paper, Popover } from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import SearchIcon from "@mui/icons-material/Search";
import SearchModal from "./SearchModal";
import StoreLogo from "./Logo";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import HistoryIcon from "@mui/icons-material/History";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import RateReviewIcon from "@mui/icons-material/RateReview";

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    right: -3,
    top: 13,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: "0 4px",
  },
}));

const pages = ["Phone", "Laptops", "Headphones", "Camera", "Monitors"];

function Navbar() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(undefined);
  const [open, setOpen] = React.useState(false);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  let userName;
  if (user) {
    userName = user.userName;
  }

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleOpenUserMenuDrawer = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseUserMenuDrawer = () => {
    setAnchorEl(null);
  };

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setDrawerOpen(open);
  };

  const location = useLocation();

  if (
    location.pathname === "/Admin/Dashboard" ||
    location.pathname === "/Administrator" ||
    location.pathname === "/Admin/Users" ||
    location.pathname === "/Admin/Products" ||
    location.pathname === "/addproduct" ||
    location.pathname === "/Product/edit/:id" ||
    location.pathname === "/Login" ||
    location.pathname === "/Signup" 
  ) {
    return null;
  }

  if (location.pathname.startsWith("/Product/edit/")) {
    return null;
  }
  const ItemQuantity = useContext(cartcontext);
  const { cartitem } = ItemQuantity;

  const drawer = (
    <Box
      sx={{
        width: 250,
        paddingTop: "20px",
        height: "100%",
        position: "relative",
      }}
      role="presentation"
    >
      {pages.map((page) => (
        <ListItem
          button
          key={page}
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/Category/${page}`);
            setDrawerOpen(false);
          }}
        >
          <ListItemText primary={page} />
        </ListItem>
      ))}

      {user ? (
        <Box sx={{ position: "absolute", bottom: 0, width: "100%", p: 1 }}>
          <ListItem
            button
            onClick={(e) => {
              e.stopPropagation();
              setAnchorEl(e.currentTarget);
            }}
            sx={{
              alignItems: "flex-start",
              gap: 1,
              "&.Mui-focusVisible, &:active": {
                backgroundColor: "transparent",
                transform: "none",
              },
              "&:active": {
                transform: "none",
              },
            }}
          >
            {/* <ListItemIcon> */}
            <Avatar
              sx={{
                bgcolor: "black",
                width: 32,
                height: 32,
                transition: "transform 0.2s ease-in-out",
                // Scale down slightly when popover is open
                ...(anchorEl && {
                  transform: "scale(0.95)",
                }),
              }}
            >
              {user.userName.toUpperCase()[0]}
            </Avatar>
            {/* </ListItemIcon> */}
            <ListItemText
              primary={user.userName}
              secondary="View account"
              sx={{ mt: 0.5 }}
            />
          </ListItem>

          <Popover
            open={Boolean(anchorEl)}
            anchorEl={anchorEl}
            onClose={() => setAnchorEl(null)}
            anchorOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
            transformOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            container={document.querySelector(".MuiDrawer-paper")}
            sx={{
              "& .MuiPaper-root": {
                boxShadow: 3,
                minWidth: 200,
              },
            }}
          >
            <MenuItem
              onClick={(e) => {
                e.stopPropagation();
                setAnchorEl(null);
                navigate(`/UserHistory/${userName}`);
              }}
            >
              <HistoryIcon sx={{ mr: 1.5 }} />
              Purchase History
            </MenuItem>
            <MenuItem
              onClick={(e) => {
                e.stopPropagation();
                setAnchorEl(null);
                navigate(`/Reviews/${userName}`);
              }}
            >
              <RateReviewIcon sx={{ mr: 1.5 }} />
              Your Reviews
            </MenuItem>
            <Divider />
            <MenuItem
              onClick={(e) => {
                e.stopPropagation();
                setAnchorEl(null);
                localStorage.clear();
                navigate("/");
              }}
              sx={{ color: "error.main" }}
            >
              <ExitToAppIcon sx={{ mr: 1.5 }} />
              Logout
            </MenuItem>
          </Popover>
        </Box>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: "5px",
            width: "100%",
            position: "absolute",
            bottom: "0",
          }}
        >
          <h5
            style={{
              fontFamily: "sans-serif",
              width: "80%",
              marginBottom: "10px",
            }}
          >
            My Account
          </h5>
          <Button
            variant="outlined"
            onClick={() => navigate("/Login")}
            sx={{ width: "80%", textTransform: "capitalize" }}
          >
            Login
          </Button>
          <Button
            onClick={() => navigate("/Signup")}
            sx={{ width: "80%", textTransform: "capitalize" }}
          >
            Register
          </Button>
        </div>
      )}
    </Box>
  );

  return (
    <AppBar
      position="static"
      sx={{ backgroundColor: "white", boxShadow: "none", zIndex: 1000 }}
    >
      <Container maxWidth="xl" sx={{ padding: "0px !important" }}>
        <Toolbar disableGutters sx={{ justifyContent: "space-between" }}>
          <Divider sx={{ display: { xs: "none", md: "flex" } }}>
            <Typography
              variant="h5"
              noWrap
              component="a"
              onClick={() => {
                navigate("/");
              }}
              sx={{
                mr: 2,
                display: { xs: "none", md: "flex", alignItems: "center" },
                fontWeight: 700,
                color: "black",
                textDecoration: "none",
                cursor: "pointer",
                fontSize: "30px",
              }}
            >
              <StoreLogo />
            </Typography>
          </Divider>
          <Divider sx={{ display: { xs: "flex", md: "none" } }}>
            <Box
              sx={{
                flexGrow: 1,
                display: { xs: "flex", md: "none" },
              }}
            >
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={toggleDrawer(true)}
                color="inherit"
              >
                <MenuIcon sx={{ color: "black" }} />
              </IconButton>
              <Drawer
                anchor="left"
                open={drawerOpen}
                onClose={toggleDrawer(false)}
              >
                {drawer}
              </Drawer>
            </Box>
          </Divider>
          <Divider sx={{ display: { xs: "flex", md: "none" } }}>
            <Typography
              variant="h5"
              noWrap
              component="a"
              onClick={() => {
                navigate("/");
              }}
              sx={{
                mr: 2,
                display: { xs: "flex", md: "none", alignItems: "center" },
                flexGrow: 1,
                fontWeight: 700,
                color: "black",
                textDecoration: "none",
                cursor: "pointer",
                fontSize: "30px",
              }}
            >
              <StoreLogo />
            </Typography>
          </Divider>
          <Divider sx={{ display: { xs: "none", md: "flex" } }}>
            <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
              {pages.map((page) => (
                <Button
                  key={page}
                  onClick={handleCloseNavMenu}
                  sx={{ my: 2, color: "black", display: "block" }}
                >
                  <Typography
                    textAlign="center"
                    sx={{ color: "black" }}
                    onClick={() => navigate(`/Category/${page}`)}
                  >
                    {page}
                  </Typography>
                </Button>
              ))}
            </Box>
          </Divider>
          <div>
            <Box
              sx={{
                flexGrow: 0,
                width: "50%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {location.pathname === "/" ? (
                <SearchIcon
                  sx={{ color: "black", marginRight: "0px" }}
                  onClick={handleOpen}
                />
              ) : null}
              {user ? (
                <Box sx={{ display: { xs: "none", md: "flex" } }}>
                  <Tooltip title="Open settings">
                    <IconButton
                      onClick={handleOpenUserMenu}
                      sx={{
                        p: 0,
                        width: "40px",
                        height: "40px",
                        marginLeft: "5px",
                      }}
                    >
                      <Avatar sx={{ bgcolor: "black" }}>
                        {user.userName.toUpperCase()[0]}
                      </Avatar>
                    </IconButton>
                  </Tooltip>
                </Box>
              ) : (
                <LoginIcon
                  sx={{
                    color: "black",
                    marginRight: "5px",
                    cursor: "pointer",
                    display: { xs: "none", md: "flex" },
                  }}
                  onClick={() => navigate("/Login")}
                />
              )}
              (
              <Link to={"/Cart"} style={{ color: "white" }}>
                <IconButton sx={{ p: 0, marginLeft: "5px" }}>
                  <StyledBadge
                    badgeContent={cartitem.length}
                    sx={{ color: "black" }}
                  >
                    <ShoppingCartIcon />
                  </StyledBadge>
                </IconButton>
              </Link>
              )
            </Box>
          </div>
        </Toolbar>
      </Container>
      <SearchModal open={open} setOpen={setOpen} />
      <Menu
        sx={{ mt: "45px" }}
        id="menu-appbar"
        anchorEl={anchorElUser}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        open={Boolean(anchorElUser)}
        onClose={handleCloseUserMenu}
      >
        <Paper elevation={0} sx={{ textAlign: "center" }}>
          <div style={{ marginBottom: "8px" }}>
            <Button
              sx={{ width: "100%", textTransform: "capitalize" }}
              variant="text"
              onClick={() => navigate(`/UserHistory/${userName}`)}
            >
              Purchase History
            </Button>
          </div>
          <div style={{ marginBottom: "8px" }}>
            <Button
              sx={{ width: "100%", textTransform: "capitalize" }}
              variant="text"
              onClick={() => navigate(`/Reviews/${userName}`)}
            >
              Your Reviews
            </Button>
          </div>
          <div>
            <Button
              sx={{}}
              color="error"
              onClick={() => {
                localStorage.clear();
                navigate("/");
              }}
            >
              Logout
            </Button>
          </div>
        </Paper>
      </Menu>
    </AppBar>
  );
}
export default Navbar;
