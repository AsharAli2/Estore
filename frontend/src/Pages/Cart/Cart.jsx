import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router";
import cartcontext from "../../context/Cartcontext";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { API_URL } from "../../../utils/constant";
import {
  Backdrop,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Container,
  Grid,
  Paper,
  Stack,
  Typography,
  IconButton,
  CircularProgress,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

export default function Cart() {
  const navigate = useNavigate();
  const CartItem = useContext(cartcontext);
  let { cartitem, removecart, setcartitem } = CartItem;
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [quantities, setQuantities] = useState(
    cartitem.reduce((acc, item) => ({ ...acc, [item.id]: 1 }), {})
  );

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user) {
      navigate("/Login");
    }
    // Simulate a delay for user check
  }, []);
  // Update quantity for a specific item
  const updateQuantity = (id, value) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(1, (prev[id] || 1) + value), // Only update the quantity for the specific item
    }));
  };

  // Calculate total price based on quantity
  const totalPrice = cartitem.reduce(
    (sum, item) => sum + item.price * (quantities[item.id] || 1),
    0
  );

  // Submit order
  const submitOrder = async () => {
    const orderData = {
      username: user.userName,
      products: cartitem.map((item) => ({
        productName: item.name,
        imageUrl: item.image,
        quantity: quantities[item.id] || 1,
        price: item.price,
      })),
      totalPrice: totalPrice,
    };

    try {
      const response = await fetch(`${API_URL}/order/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) throw new Error("Order failed");

      setOpen(true);
      setcartitem([]); // Clear cart after successful order
    } catch (error) {
      console.error("Order Error:", error);
      // Add error handling UI here
    }
  };

  const handleClose = () => {
    setOpen(false);
    navigate(`/UserHistory/${user.userName}`);
  };

  if (loading) {
    // Show CircularProgress while loading
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {cartitem.length ? (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            {cartitem.map((item) => (
              <Card key={item._id} sx={{ display: "flex", mb: 2, p: 2 }}>
                <CardMedia
                  component="img"
                  image={item.image}
                  alt={item.name}
                  sx={{ width: 120, height: 120, borderRadius: 2 }}
                />
                <CardContent sx={{ flex: 1, pl: 2 }}>
                  <Typography variant="h6" fontWeight={600}>
                    {item.name}
                  </Typography>
                  <Typography color="primary" fontWeight={500}>
                    Rs.{item.price} × {quantities[item._id] || 1}
                  </Typography>

                  <Stack direction="row" spacing={1} alignItems="center" mt={1}>
                    <IconButton
                      size="small"
                      onClick={() => updateQuantity(item._id, -1)}
                      disabled={quantities[item._id] <= 1}
                    >
                      <RemoveIcon />
                    </IconButton>
                    <Typography>{quantities[item._id] || 1}</Typography>
                    <IconButton
                      size="small"
                      onClick={() => updateQuantity(item._id, 1)}
                    >
                      <AddIcon />
                    </IconButton>
                  </Stack>

                  <Button
                    size="small"
                    sx={{ mt: 1, color: "red" }}
                    onClick={() => removecart(item.id)}
                  >
                    Remove
                  </Button>
                </CardContent>
              </Card>
            ))}
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h6" fontWeight={600} mb={2}>
                Order Summary
              </Typography>
              <Stack spacing={1.5}>
                <Typography>Items: {cartitem.length}</Typography>
                <Typography>
                  Total Price: <b>Rs.{totalPrice.toFixed(2)}</b>
                </Typography>
                <Typography color="success.main">Free Delivery</Typography>
              </Stack>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 3 }}
                onClick={submitOrder}
              >
                Proceed to Checkout
              </Button>
            </Paper>
          </Grid>
        </Grid>
      ) : (
        <Box textAlign="center" mt={5}>
          <img
            src="https://m.media-amazon.com/images/G/01/cart/empty/kettle-desaturated._CB445243794_.svg"
            alt="Empty Cart"
            width="300"
          />
          <Typography variant="h5" mt={2} fontFamily="cursive">
            Your cart is empty
          </Typography>
        </Box>
      )}

      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
      >
        <Paper
          elevation={3}
          sx={{ p: 3, textAlign: "center", borderRadius: 2 }}
        >
          <CheckCircleIcon color="success" sx={{ fontSize: 60 }} />
          <Typography variant="h5" mt={1}>
            Order Placed Successfully!
          </Typography>
          <Typography mt={1} color="success.main">
            Our rider will contact you soon.
          </Typography>
          <Button
            variant="contained"
            fullWidth
            sx={{ mt: 2 }}
            onClick={handleClose}
          >
            View Orders
          </Button>
        </Paper>
      </Backdrop>
    </Container>
  );
}
