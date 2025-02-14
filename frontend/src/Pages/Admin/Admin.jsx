import { Box, Button, Container, Grid, Paper, Typography } from "@mui/material";
import React from "react";
import CableIcon from "@mui/icons-material/Cable";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import PersonIcon from "@mui/icons-material/Person";
import ProductionQuantityLimitsIcon from "@mui/icons-material/ProductionQuantityLimits";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router";
export default function Admin() {
  const navigate = useNavigate();

  function logout() {
    localStorage.clear();
    navigate("/");
  }
  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: "10px",
          backgroundColor: "#1b2342",
          paddingTop: "15px",
          paddingBottom: "10px",
        }}
      >
        <CableIcon
          sx={{
            color: "#1976D2",
            display: "flex",
            mr: 1,
          }}
        />

        <Typography
          variant="h6"
          noWrap
          component="a"
          href=""
          sx={{
            mr: 2,
            display: "flex",
            // fontFamily: "monospace",
            fontWeight: 700,
            letterSpacing: ".3rem",
            color: "white",
            textDecoration: "none",
          }}
        >
          Estore
        </Typography>
      </div>
      <Box
        sx={{
          display: { xs: "flex", sm: "flex", md: "block" },
          justifyContent: "center",
          alignItems: "center",
          paddingLeft: { md: "58px" },
          flexWrap: { xs: "wrap", sm: "wrap" },
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "start",
            alignItems: "center",
            marginBottom: { md: "20px" },
            marginTop: { md: "20px" },
          }}
        >
          <DashboardOutlinedIcon
            sx={{ color: "grey", fontSize: { xs: "22px" } }}
          />
          <Button
            variant=""
            sx={{ color: "white", fontSize: { xs: "12px" } }}
            onClick={() => navigate("/Admin/Dashboard")}
          >
            Dashboard
          </Button>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "start",
            alignItems: "center",
            marginBottom: { md: "20px" },
            marginTop: { md: "20px" },
          }}
        >
          <PersonIcon sx={{ color: "grey", fontSize: { xs: "22px" } }} />
          <Button
            variant=""
            sx={{ color: "white", fontSize: { xs: "12px" } }}
            onClick={() => navigate("/Admin/Users")}
          >
            Users
          </Button>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "start",
            alignItems: "center",
            marginBottom: { md: "20px" },
            marginTop: { md: "20px" },
          }}
        >
          <ProductionQuantityLimitsIcon
            sx={{ color: "grey", fontSize: { xs: "22px" } }}
          />
          <Button
            variant=""
            sx={{ color: "white", fontSize: { xs: "12px" } }}
            onClick={() => navigate("/Admin/Products")}
          >
            Products
          </Button>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "start",
            alignItems: "center",
            marginBottom: { md: "20px" },
            marginTop: { md: "20px" },
          }}
        >
          <LogoutIcon sx={{ color: "grey", fontSize: { xs: "22px" } }} />
          <Button
            variant=""
            sx={{ color: "white", fontSize: { xs: "12px" } }}
            onClick={logout}
          >
            Logout
          </Button>
        </Box>
      </Box>
    </>
  );
}
