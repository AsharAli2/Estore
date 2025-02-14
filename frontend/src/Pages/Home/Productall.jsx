// import React, { useEffect, useState } from "react";
// import { Link, useParams } from "react-router-dom";
// import {
//   Button,
//   Card,
//   CardMedia,
//   Typography,
//   Container,
//   Checkbox,
//   FormControlLabel,
//   CircularProgress,
//   Grid,
//   Skeleton,
//   Accordion,
//   AccordionSummary,
//   AccordionDetails,
//   FormGroup,
//   Paper,
//   Chip,
// } from "@mui/material";
// import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
// import { API_URL } from "../../../utils/constant";

// export default function Productall() {
//   const [Product, setProduct] = useState([]);
//   const [brands, setBrands] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const { name } = useParams();
//   const [windowWidth, setWindowWidth] = useState(window.innerWidth);

//   let value = windowWidth < 800 ? 6 : windowWidth < 1000 ? 4 : 3;

//   useEffect(() => {
//     const fetchProducts = async () => {
//       setIsLoading(true);
//       const response = await fetch(`${API_URL}/products/Category/${name}`);
//       const data = await response.json();
//       setProduct(data.Product);
//       setIsLoading(false);
//     };

//     fetchProducts();
//     window.addEventListener("resize", () => setWindowWidth(window.innerWidth));
//   }, [name]);

//   const uniqueBrands = [...new Set(Product.map((item) => item.Brand))];

//   const handleBrandChange = (e) => {
//     const { value, checked } = e.target;
//     setBrands(checked ? [...brands, value] : brands.filter((b) => b !== value));
//   };

//   const filteredProducts = brands.length
//     ? Product.filter((item) => brands.includes(item.Brand))
//     : Product;

//   const priceFilter = async (filter) => {
//     setIsLoading(true);
//     const response = await fetch(
//       `${API_URL}/products/Category/${name}/${filter}`
//     );
//     const data = await response.json();
//     setProduct(data.Product);
//     setIsLoading(false);
//   };

//   return (
//     <Container>
//       <Grid container spacing={2}>
//         <Grid item xs={12}>
//           <Paper elevation={3} sx={{ padding: 2, marginBottom: 2 }}>
//             <Typography variant="h6">Filters</Typography>
//             <FormGroup row>
//               {uniqueBrands.map((brand) => (
//                 <FormControlLabel
//                   key={brand}
//                   control={
//                     <Checkbox value={brand} onChange={handleBrandChange} />
//                   }
//                   label={brand}
//                 />
//               ))}
//             </FormGroup>
//             <div style={{ marginTop: 10 }}>
//               <Typography variant="h6">Sort By Price:</Typography>
//               <Button
//                 variant="contained"
//                 size="small"
//                 onClick={() => priceFilter("Low")}
//                 sx={{ marginRight: 1 }}
//               >
//                 Low to High
//               </Button>
//               <Button
//                 variant="contained"
//                 size="small"
//                 onClick={() => priceFilter("High")}
//               >
//                 High to Low
//               </Button>
//             </div>
//           </Paper>
//         </Grid>

//         {isLoading
//           ? Array.from(new Array(6)).map((_, index) => (
//               <Grid item xs={value} key={index}>
//                 <Skeleton variant="rectangular" width={240} height={300} />
//                 <Skeleton width="80%" />
//                 <Skeleton width="60%" />
//               </Grid>
//             ))
//           : filteredProducts.map((item) => (
//               <Grid item xs={value} key={item._id}>
//                 <Link
//                   to={`/Product/${item._id}`}
//                   style={{ textDecoration: "none" }}
//                 >
//                   <Card sx={{ maxWidth: 240, maxHeight: 300 }}>
//                     <CardMedia
//                       component="img"
//                       sx={{ height: 200, width: "100%", objectFit: "cover" }}
//                       image={item.image}
//                       title={item.name}
//                       loading="lazy"
//                     />
//                     <Typography
//                       variant="body1"
//                       sx={{ textAlign: "center", padding: 1 }}
//                     >
//                       {item.name}
//                     </Typography>
//                     <Typography
//                       variant="body2"
//                       sx={{ textAlign: "center", color: "gray" }}
//                     >
//                       Rs.{item.price}
//                     </Typography>
//                   </Card>
//                 </Link>
//               </Grid>
//             ))}
//       </Grid>
//     </Container>
//   );
// }

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
    <Container>
      {/* Filter button that toggles the side drawer */}
      <IconButton onClick={() => setIsFilterOpen(true)} sx={{ marginTop: 2 }}>
        <FilterListIcon />
      </IconButton>

      {/* Drawer with filter options */}
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
                    <CardMedia
                      component="img"
                      sx={{ height: 200, width: "100%", objectFit: "cover" }}
                      image={item.image}
                      title={item.name}
                      loading="lazy"
                    />
                    <Typography
                      variant="body1"
                      sx={{ textAlign: "center", padding: 1 }}
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
  );
}
