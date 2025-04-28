
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Button,
  Card,
  CardMedia,
  Typography,
  Container,
  Checkbox,
  FormControlLabel,
  Grid,
  Skeleton,
  FormGroup,
  IconButton,
  Drawer,
  Box,
  CircularProgress,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import { API_URL } from "../../../utils/constant";

export default function Productall() {
  const [Product, setProduct] = useState([]);
  const [brands, setBrands] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { name } = useParams();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [imageLoaded, setImageLoaded] = useState({});

  let value = windowWidth < 800 ? 6 : windowWidth < 1000 ? 4 : 3;

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/products/Category/${name}`);
      const data = await response.json();
      setProduct(data.Product);
      setIsLoading(false);
    };

    fetchProducts();
    window.addEventListener("resize", () => setWindowWidth(window.innerWidth));
  }, [name]);

  const uniqueBrands = [...new Set(Product.map((item) => item.Brand))];

  const handleBrandChange = (e) => {
    const { value, checked } = e.target;
    setBrands(checked ? [...brands, value] : brands.filter((b) => b !== value));
  };

  const filteredProducts = brands.length
    ? Product.filter((item) => brands.includes(item.Brand))
    : Product;

  const priceFilter = async (filter) => {
    setIsLoading(true);
    const response = await fetch(
      `${API_URL}/products/Category/${name}/${filter}`
    );
    const data = await response.json();
    setProduct(data.Product);
    setIsLoading(false);
  };

  return (
    <>
      <Container>
        <IconButton onClick={() => setIsFilterOpen(true)} sx={{ marginTop: 2 }}>
          <FilterListIcon />
        </IconButton>

        <Drawer
          anchor="left"
          open={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
        >
          <div style={{ width: "250px", padding: "20px" }}>
            <Typography variant="h6">Filters</Typography>
            <FormGroup>
              {uniqueBrands.map((brand) => (
                <FormControlLabel
                  key={brand}
                  control={
                    <Checkbox value={brand} onChange={handleBrandChange} />
                  }
                  label={brand}
                />
              ))}
            </FormGroup>
            <div style={{ marginTop: 10 }}>
              <Typography variant="h6">Sort By Price:</Typography>
              <Button
                variant="contained"
                size="small"
                onClick={() => {
                  priceFilter("Low");
                  setIsFilterOpen(false);
                }}
                sx={{ marginRight: 1 }}
              >
                Low to High
              </Button>
              <Button
                variant="contained"
                size="small"
                onClick={() => {
                  priceFilter("High");
                  setIsFilterOpen(false);
                }}
              >
                High to Low
              </Button>
            </div>
          </div>
        </Drawer>

        <Grid container spacing={2} sx={{ marginTop: 2 }}>
          {isLoading
            ? Array.from(new Array(6)).map((_, index) => (
                <Grid item xs={value} key={index}>
                  <Skeleton variant="rectangular" width={240} height={300} />
                  <Skeleton width="80%" />
                  <Skeleton width="60%" />
                </Grid>
              ))
            : filteredProducts.map((item) => (
                <Grid item xs={value} key={item._id}>
                  <Link
                    to={`/Product/${item._id}`}
                    style={{ textDecoration: "none" }}
                  >
                    <Card sx={{ maxWidth: 240, maxHeight: 300 }}>
                      <Box sx={{ height: 200, position: "relative" }}>
                        {!imageLoaded[item._id] && (
                          <Skeleton
                            variant="rectangular"
                            width={240}
                            height={200}
                          />
                        )}
                        <CardMedia
                          component="img"
                          image={item.image}
                          title={item.name}
                          sx={{
                            height: 200,
                            width: "100%",
                            objectFit: "cover",
                            display: imageLoaded[item._id] ? "block" : "none",
                          }}
                          onLoad={() =>
                            setImageLoaded((prev) => ({
                              ...prev,
                              [item._id]: true,
                            }))
                          }
                        />
                      </Box>
                      <Typography
                        variant="body1"
                        sx={{
                          textAlign: "center",
                          padding: 1,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {item.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ textAlign: "center", color: "gray" }}
                      >
                        Rs.{item.price}
                      </Typography>
                    </Card>
                  </Link>
                </Grid>
              ))}
        </Grid>
      </Container>
      {/* Beautiful Footer */}
      <Box
        sx={{
          marginTop: 6,
          padding: 4,
          backgroundColor: "#1e1e1e",
          textAlign: "center",
          color: "white",
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: "bold", mb: 1 }}>
          Estore
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.7 }}>
          Your one-stop destination for quality products.
        </Typography>
        <Box
          sx={{
            marginTop: 3,
            display: "flex",
            justifyContent: "center",
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          <Button variant="text" sx={{ color: "white" }}>
            Privacy Policy
          </Button>
          <Button variant="text" sx={{ color: "white" }}>
            Terms of Service
          </Button>
          <Button variant="text" sx={{ color: "white" }}>
            Contact Us
          </Button>
        </Box>
        <Typography
          variant="caption"
          display="block"
          sx={{ mt: 3, opacity: 0.6 }}
        >
          © 2025 Estore. All rights reserved.
        </Typography>
      </Box>
    </>
  );
}
