import { useState } from "react";
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
  Container,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { API_URL } from "../../../utils/constant";

const LoginPage = () => {
  const navigate = useNavigate();

  const [data, setdata] = useState([]);
  const [userName, setuserName] = useState("");
  const [password, setpassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        padding: 2,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            borderRadius: 3,
            textAlign: "center",
            backgroundColor: "#ffffff",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
          }}
        >
          {/* Logo / Header */}
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 800,
                color: "#2c3e50",
                mb: 1,
              }}
            >
              Estore
            </Typography>
            <Typography variant="body1" color="#7f8c8d">
              Welcome back to your shopping destination
            </Typography>
          </Box>

          {/* Username Field */}
          <TextField
            fullWidth
            variant="outlined"
            name="userName"
            placeholder="Username"
            value={userName}
            onChange={textchange}
            sx={{
              mb: 2.5,
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                fontSize: "0.95rem",
              },
            }}
          />

          {/* Password Field */}
          <TextField
            fullWidth
            type={showPassword ? "text" : "password"}
            variant="outlined"
            name="password"
            placeholder="Password"
            value={password}
            onChange={textchange}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleClickShowPassword}
                    edge="end"
                    size="small"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              mb: 3,
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                fontSize: "0.95rem",
              },
            }}
          />

          {/* Sign In Button */}
          <Button
            fullWidth
            variant="contained"
            onClick={submit}
            disabled={!userName.length || !password.length || loading}
            sx={{
              padding: "12px",
              borderRadius: 2,
              fontWeight: "bold",
              fontSize: "1rem",
              textTransform: "none",
              backgroundColor: "#3498db",
              color: "#ffffff",
              mb: 2,
              "&:hover": {
                backgroundColor: "#2980b9",
              },
              "&:disabled": {
                backgroundColor: "rgba(0, 0, 0, 0.12)",
              },
            }}
          >
            {loading ? (
              <CircularProgress size={24} sx={{ color: "white" }} />
            ) : (
              "Sign In"
            )}
          </Button>

          {/* Divider */}
          <Typography variant="body2" color="text.secondary" sx={{ my: 2 }}>
            Don&apos;t have an account yet?
          </Typography>

          {/* Sign Up Button */}
          <Button
            fullWidth
            variant="outlined"
            onClick={() => navigate("/Signup")}
            sx={{
              padding: "12px",
              borderRadius: 2,
              fontWeight: "bold",
              fontSize: "1rem",
              textTransform: "none",
              borderColor: "#3498db",
              color: "#3498db",
              "&:hover": {
                backgroundColor: "rgba(52, 152, 219, 0.08)",
                borderColor: "#3498db",
              },
            }}
          >
            Create Account
          </Button>

          {/* Error/Success Snackbar */}
          <Snackbar
            anchorOrigin={{ vertical, horizontal }}
            open={open}
            autoHideDuration={2000}
            onClose={handleClose}
          >
            <Alert
              severity={data.User ? "success" : "error"}
              variant="filled"
              sx={{ width: "100%", borderRadius: 2 }}
            >
              {data.message}
            </Alert>
          </Snackbar>
        </Paper>
      </Container>
    </Box>
  );
};

export default LoginPage;
