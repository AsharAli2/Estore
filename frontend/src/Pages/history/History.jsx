import {
  Card,
  Container,
  Grid,
  Typography,
  Box,
  Button,
  CircularProgress,
  Avatar,
  Chip,
  Divider,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { API_URL } from "../../../utils/constant";
import { format } from "date-fns"; // For date formatting
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import HistoryIcon from "@mui/icons-material/History";

export default function History() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userName } = useParams();

  useEffect(() => {
    const fetchOrderHistory = async () => {
      try {
        const response = await fetch(`${API_URL}/order/history/${userName}`);
        const data = await response.json();
        setOrders(data.orders || []);
      } catch (error) {
        console.error("Error fetching order history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderHistory();
  }, [userName]);

  if (loading) {
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
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ textAlign: "center", mb: 4 }}>
        <Avatar
          sx={{
            bgcolor: "primary.main",
            width: 56,
            height: 56,
            mx: "auto",
            mb: 2,
          }}
        >
          <HistoryIcon fontSize="large" />
        </Avatar>
        <Typography variant="h4" fontWeight="bold" color="primary">
          Order History
        </Typography>
        <Typography variant="subtitle1" color="textSecondary">
          Welcome back, {userName}! Here's your purchase history.
        </Typography>
      </Box>

      {orders.length > 0 ? (
        <Grid container spacing={3}>
          {orders.map((order) => (
            <Grid item xs={12} key={order.id}>
              <Card
                sx={{
                  p: 3,
                  borderRadius: 2,
                  boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 2,
                  }}
                >
                  <Typography variant="h6" fontWeight="bold">
                    Order ID: #{order.id.slice(-6).toUpperCase()}
                  </Typography>
                  <Chip
                    label={`Total: Rs. ${order.totalPrice.toFixed(2)}`}
                    color="primary"
                    variant="outlined"
                  />
                </Box>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{ mb: 2 }}
                >
                  Ordered on:{" "}
                  {format(new Date(order.date), "dd MMM yyyy, hh:mm a")}
                </Typography>

                <Divider sx={{ my: 2 }} />

                <Grid container spacing={2}>
                  {order.products.map((product, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Avatar
                          src={product.imageUrl}
                          alt={product.productName}
                          variant="square"
                          sx={{ width: 56, height: 56, mr: 2 }}
                        />
                        <Box>
                          <Typography variant="subtitle1" fontWeight="medium">
                            {product.productName}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            {product.quantity} x Rs. {product.price.toFixed(2)}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            minHeight: "50vh",
          }}
        >
          <Avatar
            sx={{ bgcolor: "action.disabled", width: 80, height: 80, mb: 2 }}
          >
            <ShoppingCartIcon fontSize="large" />
          </Avatar>
          <Typography variant="h5" fontWeight="bold" sx={{ mb: 1 }}>
            No Orders Found
          </Typography>
          <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
            You haven't placed any orders yet. Start shopping now!
          </Typography>
          <Button variant="contained" color="primary" size="large">
            Browse Products
          </Button>
        </Box>
      )}
    </Container>
  );
}
