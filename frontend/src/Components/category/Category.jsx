import React from "react";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Grid,
  Button,
} from "@mui/material";

import { useNavigate } from "react-router";

const ProductGrid = () => {
  const navigate = useNavigate();
  const products = [
    {
      id: 1,
      title: "iPhones",
      brand: "Apple",
      image:
        "https://regen.pk/cdn/shop/files/REGEN-iPhone16-White.png?v=1735555022&width=1400",
      isLarge: true,
      navigation: "/Category/Phone",
    },
    {
      id: 2,
      title: "Headphones",
      brand: "Apple",
      image:
        "https://img.freepik.com/premium-photo/black-wireless-headphones-isolated-black-background_95544-15.jpg",
      navigation: "/Category/Headphones",
    },
    {
      id: 3,
      title: "Macs",
      brand: "Apple",
      image:
        "https://regen.pk/cdn/shop/files/REGEN-Macbook-pro-m1-2020-topview.png?v=1682403635&width=1400",
      navigation: "/Category/Laptops",
    },
    {
      id: 4,
      title: "Monitors",
      brand: "Samsung",
      image:
        "https://www.technoo.pk/cdn/shop/products/pk-t35f-lf24t350fhmxzn-530491885.png?v=1668087338",
      navigation: "/Category/Monitors",
    },
    {
      id: 5,
      title: "Camera",
      brand: "Canon",
      image:
        "https://www.camerahouse.com.au/media/catalog/product/r/5/r5iipk_canon_eos_r5_mark_ii_body_w_rf24-105mm_f4l_1.jpg?width=600&height=556&optimize=medium&fit=bounds",
      navigation: "/Category/Camera",
    },
  ];

  return (
    <>
      <div style={{ marginBottom: "40px" }} id="Choose">
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            textAlign: "center",
            fontSize: { xs: "19px", sm: "24px", md: "29px", lg: "34px" },
          }}
        >
          Certified Pre-Owned Devices
        </Typography>
        <Typography
          variant="subtitle2"
          gutterBottom
          sx={{
            textAlign: "center",
            fontFamily: "monospace",
            fontSize: { xs: "8px", sm: "10px", md: "12x", lg: "14px" },
          }}
        >
          Certified by our team of experts, backed with ESTORE's 1-2 Years
          Warranty!
        </Typography>
      </div>
      <Box sx={{ flexGrow: 1, p: 2 }}>
        <Grid container spacing={2}>
          {/* Large iPhone Card */}
          <Grid item xs={12} md={6} lg={6}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                position: "relative",
              }}
            >
              <CardMedia
                component="img"
                image={products[0].image}
                alt={products[0].title}
                sx={{
                  // height: { xs: "300px", sm: "400px", md: "600px" },
                  objectFit: "cover",
                }}
              />
              <CardContent
                sx={{
                  position: { xs: "static", md: "absolute" },
                  bottom: { md: 0 },
                  width: "100%",
                  // bgcolor: { xs: "transparent", md: "rgba(255, 255, 255, 0.9)" },
                  p: { xs: 2, md: 3 },
                }}
              >
                <Typography
                  variant="overline"
                  component="div"
                  sx={{ color: { xs: "text.primary", md: "text.primary" } }}
                >
                  {products[0].brand}
                </Typography>
                <Typography
                  variant="h5"
                  component="div"
                  sx={{
                    color: { xs: "text.primary", md: "text.primary" },
                    mb: 1,
                  }}
                >
                  {products[0].title}
                </Typography>
                <Button
                  variant="outlined"
                  sx={{
                    mt: 1,
                    textTransform: "none",
                    borderColor: "text.primary",
                    color: "text.primary",
                    "&:hover": {
                      borderColor: "text.primary",
                      bgcolor: "rgba(0, 0, 0, 0.04)",
                    },
                  }}
                  onClick={() => {
                    navigate(`${products[0].navigation}`);
                  }}
                >
                  Shop now
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* Right side grid */}

          <Grid item xs={12} md={6} lg={6}>
            <Grid container spacing={2}>
              {products.slice(1).map((product) => (
                <Grid item xs={12} sm={6} md={6} key={product.id}>
                  {" "}
                  {/* Ensure two items per row in md */}
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      alignItems: "center",
                      textAlign: "center",
                    }}
                  >
                    <CardMedia
                      component="img"
                      image={product.image}
                      alt={product.title}
                      sx={{
                        // height: { xs: "200px", sm: "220px", md: "250px" }, // Adjust height to fit better
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                    <CardContent>
                      <Typography variant="overline">
                        {product.brand}
                      </Typography>
                      <Typography variant="h6" sx={{ mb: 1 }}>
                        {product.title}
                      </Typography>
                      <Button
                        variant="outlined"
                        sx={{ textTransform: "none" }}
                        onClick={() => navigate(`${product.navigation}`)}
                      >
                        Shop now
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default ProductGrid;
