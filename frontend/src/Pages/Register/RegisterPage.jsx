import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Snackbar,
  Alert,
  TextField,
  Box,
  Typography,
  CircularProgress,
  Container,
  Paper,
  InputAdornment,
  IconButton,
  Stack,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { API_URL } from "../../../utils/constant";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
      setOpenSnackbar(true);
      setTimeout(() => navigate("/Login"), 2000);
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const isFormValid = userName && password && email && phone && address;

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
          {/* Header */}
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
              Create your account to start shopping
            </Typography>
          </Box>

          <Stack spacing={2}>
            {/* Username */}
            <TextField
              fullWidth
              variant="outlined"
              name="userName"
              placeholder="Username"
              value={userName}
              onChange={handleChange}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                },
              }}
            />

            {/* Email */}
            <TextField
              fullWidth
              type="email"
              name="email"
              placeholder="Email address"
              value={email}
              onChange={handleChange}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                },
              }}
            />

            {/* Phone */}
            <TextField
              fullWidth
              type="tel"
              name="phone"
              placeholder="Phone number"
              value={phone}
              onChange={handleChange}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                },
              }}
            />

            {/* Address */}
            <TextField
              fullWidth
              multiline
              rows={2}
              name="address"
              placeholder="Delivery address"
              value={address}
              onChange={handleChange}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                },
              }}
            />

            {/* Password */}
            <TextField
              fullWidth
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={password}
              onChange={handleChange}
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
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                },
              }}
            />
          </Stack>

          {/* Register Button */}
          <Button
            fullWidth
            variant="contained"
            sx={{
              mt: 3,
              padding: "12px",
              borderRadius: 2,
              fontWeight: "bold",
              fontSize: "1rem",
              textTransform: "none",
              backgroundColor: "#3498db",
              color: "#ffffff",
              "&:hover": {
                backgroundColor: "#2980b9",
              },
              "&:disabled": {
                backgroundColor: "rgba(0, 0, 0, 0.12)",
              },
            }}
            onClick={handleSubmit}
            disabled={!isFormValid || loading}
          >
            {loading ? (
              <CircularProgress size={24} sx={{ color: "white" }} />
            ) : (
              "Create Account"
            )}
          </Button>

          {/* Sign In Link */}
          <Typography color="#7f8c8d" sx={{ mt: 2.5, mb: 1 }}>
            Already have an account?
          </Typography>
          <Button
            fullWidth
            variant="outlined"
            onClick={() => navigate("/Login")}
            sx={{
              padding: "10px",
              borderRadius: 2,
              fontWeight: "bold",
              textTransform: "none",
              borderColor: "#3498db",
              color: "#3498db",
              "&:hover": {
                backgroundColor: "rgba(52, 152, 219, 0.08)",
                borderColor: "#3498db",
              },
            }}
          >
            Sign In
          </Button>

          {/* Success Snackbar */}
          <Snackbar
            open={openSnackbar}
            autoHideDuration={3000}
            onClose={() => setOpenSnackbar(false)}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
          >
            <Alert severity="success" variant="filled" sx={{ width: "100%", borderRadius: 2 }}>
              Account created successfully! Redirecting to login...
            </Alert>
          </Snackbar>
        </Paper>
      </Container>
    </Box>
  );
};

export default RegisterPage;
