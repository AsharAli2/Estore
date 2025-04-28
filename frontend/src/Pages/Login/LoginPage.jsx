import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Button,
  Snackbar,
  TextField,
  Typography,
  Box,
  Paper,
  CircularProgress,
} from "@mui/material";
import { API_URL } from "../../../utils/constant";

const LoginPage = () => {
  const navigate = useNavigate();

  const [data, setdata] = useState([]);
  const [userName, setuserName] = useState("");
  const [password, setpassword] = useState("");
  const [state, setState] = useState({
    open: false,
    vertical: "top",
    horizontal: "center",
  });
  const { vertical, horizontal, open } = state;
  const [loading, setloading] = useState(false);

  const textchange = (ev) => {
    const { value, name } = ev.target;
    if (name === "userName") {
      setuserName(value);
    }
    if (name === "password") {
      setpassword(value);
    }
  };

  const submit = async () => {
    const userData = { userName, password };
    setloading(true);

    const response = await fetch(`${API_URL}/user/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
    const data = await response.json();
    setdata(data);

    if (data.User) {
      localStorage.setItem("token", JSON.stringify(data.token));
      localStorage.setItem("user", JSON.stringify(data.User.isUser));
      setloading(false);
      navigate(
        data.User.isUser.userName === "Admin" ? "/Admin/Dashboard" : "/"
      );
    } else {
      setState({ vertical: "bottom", horizontal: "center", open: true });
      setloading(false);
    }
  };

  const handleClose = () => {
    setState({ open: false, vertical: "top", horizontal: "center" });
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#121212",
        padding: 2,
      }}
    >
      <Paper
        elevation={10}
        sx={{
          padding: 4,
          borderRadius: 3,
          backgroundColor: "#1E1E1E",
          color: "#ffffff",
          width: 400,
          textAlign: "center",
        }}
      >
        <Typography variant="h4" fontWeight="bold" color="#E0E0E0" gutterBottom>
          Welcome Back
        </Typography>
        <Typography variant="body2" color="#B0B0B0" marginBottom={2}>
          Sign in to continue shopping
        </Typography>

        <TextField
          fullWidth
          variant="outlined"
          name="userName"
          placeholder="Username"
          value={userName}
          onChange={textchange}
          sx={{
            input: { color: "#E0E0E0" },
            label: { color: "#B0B0B0" },
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "#555" },
              "&:hover fieldset": { borderColor: "#888" },
            },
            marginBottom: 2,
          }}
        />

        <TextField
          fullWidth
          type="password"
          variant="outlined"
          name="password"
          placeholder="Password"
          value={password}
          onChange={textchange}
          sx={{
            input: { color: "#E0E0E0" },
            label: { color: "#B0B0B0" },
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "#555" },
              "&:hover fieldset": { borderColor: "#888" },
            },
            marginBottom: 3,
          }}
        />

        <Button
          fullWidth
          variant="outlined"
          onClick={submit}
          disabled={!userName.length || !password.length}
          sx={{
            padding: 1.5,
            borderRadius: 2,
            fontWeight: "bold",
          }}
        >
          {loading ? <CircularProgress /> : "Sign In"}
        </Button>

        <Typography variant="body2" color="#B0B0B0" marginY={3}>
          ─── New to Estore? ───
        </Typography>

        <Button
          fullWidth
          variant="text"
          onClick={() => navigate("/Signup")}
          sx={{
            padding: 1.5,
            borderRadius: 2,
          }}
        >
          Create your Estore Account
        </Button>

        <Snackbar
          anchorOrigin={{ vertical, horizontal }}
          open={open}
          autoHideDuration={2000}
          onClose={handleClose}
        >
          <Alert
            severity={data.User ? "success" : "error"}
            variant="filled"
            sx={{ width: "100%" }}
          >
            {data.message}
          </Alert>
        </Snackbar>
      </Paper>
    </Box>
  );
};

export default LoginPage;
