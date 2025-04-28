import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Snackbar,
  Alert,
  TextField,
  Box,
  Typography,
  Link,
  CircularProgress,
} from "@mui/material";
import { API_URL } from "../../../utils/constant";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [loading, setloading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "userName") setUserName(value);
    if (name === "password") setPassword(value);
    if (name === "email") setEmail(value);
    if (name === "phone") setPhone(value);
    if (name === "address") setAddress(value);
  };

  const handleSubmit = async () => {
    const userData = { userName, password, email, phone, address };
    setloading(true);
    const response = await fetch(`${API_URL}/user/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    const data = await response.json();
    if (data.user) {
      setloading(false);
      navigate("/login");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#0D0D0D",
      }}
    >
      <Box
        sx={{
          width: 350,
          backgroundColor: "#1A1A1A",
          padding: 3,
          borderRadius: 2,
          boxShadow: "0px 0px 10px rgba(255, 255, 255, 0.1)",
          textAlign: "center",
        }}
      >
        <Typography variant="h5" color="white" fontWeight="bold">
          Create Account
        </Typography>
        <Typography variant="body2" color="gray" mb={2}>
          Sign up to start shopping
        </Typography>

        <TextField
          fullWidth
          variant="outlined"
          name="userName"
          placeholder="Username"
          value={userName}
          onChange={handleChange}
          sx={{
            input: { color: "white" },
            mb: 1,
            backgroundColor: "#333",
            borderRadius: 2,
          }}
        />
        <TextField
          fullWidth
          type="password"
          name="password"
          placeholder="Password"
          value={password}
          onChange={handleChange}
          sx={{
            input: { color: "white" },
            mb: 1,
            backgroundColor: "#333",
            borderRadius: 2,
          }}
        />
        <TextField
          fullWidth
          type="email"
          name="email"
          placeholder="Email"
          value={email}
          onChange={handleChange}
          sx={{
            input: { color: "white" },
            mb: 1,
            backgroundColor: "#333",
            borderRadius: 2,
          }}
        />
        <TextField
          fullWidth
          type="tel"
          name="phone"
          placeholder="Phone"
          value={phone}
          onChange={handleChange}
          sx={{
            input: { color: "white" },
            mb: 1,
            backgroundColor: "#333",
            borderRadius: 2,
          }}
        />
        <TextField
          fullWidth
          name="address"
          placeholder="Address"
          value={address}
          onChange={handleChange}
          sx={{
            input: { color: "white" },
            mb: 2,
            backgroundColor: "#333",
            borderRadius: 2,
          }}
        />

        <Button
          fullWidth
          variant="outlined"
          sx={{ padding: 1.5, borderRadius: 2 }}
          onClick={handleSubmit}
          disabled={!userName || !password || !email || !phone || !address}
        >
          {loading ? <CircularProgress /> : "Register"}
        </Button>

        <Typography color="gray" mt={2}>
          Already have an account?
        </Typography>
        <Link
          onClick={() => navigate("/Login")}
          sx={{
            display: "block",
            color: "#6e98c4",
            cursor: "pointer",
            mt: 1,
            textDecoration: "none",
          }}
        >
          Sign In
        </Link>

        <Snackbar
          open={openSnackbar}
          autoHideDuration={2000}
          onClose={() => setOpenSnackbar(false)}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert severity="success" variant="filled" sx={{ width: "100%" }}>
            User Successfully Registered
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
};

export default RegisterPage;
