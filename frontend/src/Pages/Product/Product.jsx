import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Rating } from "@mui/material";
import {
  Container,
  Button,
  Typography,
  CardActions,
  IconButton,
  CardMedia,
  Grid,
  Box,
  TextField,
  Divider,
} from "@mui/material";
import Skeleton from "@mui/material/Skeleton";
import cartcontext from "../../context/Cartcontext";
import { API_URL } from "../../../utils/constant";

export default function Product() {
  const navigate = useNavigate();
  const [Loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [SingleProduct, setSingleProduct] = useState({});
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState("");
  const [rating, setRating] = useState(0);
  const Cartcontext = useContext(cartcontext);
  const { addtoCart, removecart } = Cartcontext;

  let { id } = useParams();
  const token = JSON.parse(localStorage.getItem("token"));

  useEffect(() => {
    fetchSingleProduct();
    fetchReviews();
    const isUser = localStorage.getItem("user");
    if (isUser) {
      setUser(JSON.parse(isUser));
    }
  }, []);

  const fetchSingleProduct = async () => {
    setLoading(true);
    const response = await fetch(`${API_URL}/products/${id}`);
    const data = await response.json();
    setSingleProduct(data.product);
    setLoading(false);
  };

  const fetchReviews = async () => {
    const response = await fetch(`${API_URL}/products/review/${id}`);
    const data = await response.json();
    setReviews(data.reviews || []);
  };

  const userHasReviewed = reviews.some(
    (review) => review.userName === user?.userName
  );

  const handleReviewSubmit = async () => {
    if (newReview.trim() && rating > 0) {
      const response = await fetch(`${API_URL}/products/review/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          review: newReview,
          rating: rating,
          userName: user?.userName || "Anonymous",
        }),
      });
      const data = await response.json();
      setReviews([...reviews, data.newReview]);
      setNewReview("");
      setRating(0);
    }
  };

  return (
    <Container style={{ padding: "20px" }}>
      {Loading ? (
        <Skeleton variant="circular" width={250} height={250} />
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <CardMedia
              sx={{ height: 400, width: "100%", borderRadius: "10px" }}
              image={SingleProduct.image}
              title={SingleProduct.name}
              style={{ boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Box
              style={{
                padding: "20px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                borderRadius: "10px",
              }}
            >
              <Typography variant="h4" gutterBottom>
                {SingleProduct.name}
              </Typography>
              <Typography variant="body1" color="textSecondary" paragraph>
                {SingleProduct.description}
              </Typography>
              <Typography
                variant="h5"
                color="primary"
                style={{ marginBottom: "20px" }}
              >
                Rs.{SingleProduct.price}
              </Typography>
              <CardActions>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={() => addtoCart(SingleProduct)}
                >
                  Add to Cart
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  fullWidth
                  onClick={() => removecart(SingleProduct.name)}
                >
                  Remove
                </Button>
              </CardActions>
            </Box>
          </Grid>
        </Grid>
      )}

      {/* Review Section */}
      <Box
        style={{
          marginTop: "30px",
          padding: "20px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          borderRadius: "10px",
        }}
      >
        <Typography variant="h5" gutterBottom>
          Customer Reviews
        </Typography>
        <Divider style={{ marginBottom: "20px" }} />

        {/* Review Submission Section */}
        <Box style={{ marginBottom: "20px" }}>
          <Typography variant="h6" gutterBottom>
            Write a Review
          </Typography>
          <Rating
            value={rating}
            onChange={(event, newValue) => setRating(newValue)}
            disabled={userHasReviewed}
          />
          <TextField
            label="Your Review"
            variant="outlined"
            fullWidth
            multiline
            rows={4}
            value={newReview}
            onChange={(e) => setNewReview(e.target.value)}
            disabled={userHasReviewed}
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            style={{ marginTop: "15px" }}
            onClick={handleReviewSubmit}
            disabled={userHasReviewed || rating === 0 || newReview.length === 0}
          >
            Submit Review
          </Button>
          {userHasReviewed && (
            <Typography
              variant="body2"
              color="textSecondary"
              style={{ marginTop: "10px" }}
            >
              You have already submitted a review.
            </Typography>
          )}
        </Box>

        {/* Display Reviews */}
        {reviews.length > 0 ? (
          reviews.map((review, index) => (
            <Box key={index} style={{ marginBottom: "15px" }}>
              <Typography variant="body1" color="textPrimary">
                "{review.review}"
              </Typography>
              <Rating value={review.rating} readOnly />
              <Typography
                variant="body2"
                color="textSecondary"
                style={{ marginTop: "5px" }}
              >
                - {review.userName || "Anonymous"}
              </Typography>
            </Box>
          ))
        ) : (
          <Typography variant="body2" color="textSecondary">
            No reviews yet. Be the first to review!
          </Typography>
        )}
      </Box>
    </Container>
  );
}
