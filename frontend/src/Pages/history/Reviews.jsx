import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Button,
  Box,
  Rating,
} from "@mui/material";
import { API_URL } from "../../../utils/constant";
import { useParams, useNavigate } from "react-router";
import StarIcon from "@mui/icons-material/Star";

export default function UserReviews() {
  const [reviews, setReviews] = useState([]);
  const token = JSON.parse(localStorage.getItem("token"));
  const { userName } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserReviews = async () => {
      try {
        const response = await fetch(`${API_URL}/user/reviews/${userName}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (response.ok) {
          setReviews(data.reviews || []);
        } else {
          console.error("Error fetching reviews:", data.message);
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    fetchUserReviews();
  }, []);

  return (
    <Container maxWidth="md">
      <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ mt: 3 }}>
        My Reviews
      </Typography>
      {reviews.length > 0 ? (
        reviews.map((review) => (
          <Card
            key={review._id}
            sx={{
              display: "flex",
              alignItems: "center",
              mb: 3,
              boxShadow: 3,
              borderRadius: 2,
              p: 2,
            }}
          >
            {/* Product Image */}
            <CardMedia
              component="img"
              sx={{ width: 120, height: 120, borderRadius: 2 }}
              image={review.productId.image}
              alt={review.productId.name}
            />
            <CardContent sx={{ flex: 1 }}>
              {/* Product Name */}
              <Typography variant="h6" fontWeight="bold">
                {review.productId.name}
              </Typography>

              {/* Star Rating */}
              <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                <Rating value={review.rating} precision={0.5} readOnly />
                <Typography variant="body2" sx={{ ml: 1, fontWeight: "bold" }}>
                  {review.rating}/5
                </Typography>
              </Box>

              {/* Review Text */}
              <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                "{review.review}"
              </Typography>

              {/* View Product Button */}
              <Button
                variant="contained"
                size="small"
                sx={{ mt: 2, textTransform: "none" }}
                onClick={() => navigate(`/Product/${review.productId._id}`)}
              >
                View Product
              </Button>
            </CardContent>
          </Card>
        ))
      ) : (
        <Typography>No reviews found.</Typography>
      )}
    </Container>
  );
}
