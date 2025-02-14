// import { Box, Button, Container, Grid, Typography } from "@mui/material";
// import React from "react";
// import "./category.css";
// export default function Category() {

//   return (
//     <>
//       {/* Heading */}
//       <div style={{ marginBottom: "40px" }} id="Choose">
//         <Typography
//           variant="h4"
//           gutterBottom
//           sx={{
//             textAlign: "center",
//             fontSize: { xs: "19px", sm: "24px", md: "29px", lg: "34px" },
//           }}
//         >
//           Certified Pre-Owned Devices
//         </Typography>
//         <Typography
//           variant="subtitle2"
//           gutterBottom
//           sx={{
//             textAlign: "center",
//             fontFamily: "monospace",
//             fontSize: { xs: "8px", sm: "10px", md: "12x", lg: "14px" },
//           }}
//         >
//           Certified by our team of experts, backed with ESTORE's 1-2 Years
//           Warranty!
//         </Typography>
//       </div>

//       {/* Categories */}
//       <Grid container sx={{ padding: "10px" }}>
//         <Grid item xs={3}>
//           <div
//             className="image"
//             style={{ paddingBottom: "4px", paddingRight: "4px" }}
//           >
//             <Box
//               component="img"
//               src="https://images.unsplash.com/photo-1502982720700-bfff97f2ecac?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGNhbWVyYXxlbnwwfHwwfHx8MA%3D%3D"
//               sx={{
//                 height: { xs: "15vh", sm: "30vh", md: "35vh", lg: "50vh" },
//                 width: "100%",
//                 cursor: "pointer",
//                 borderRadius: "15px",
//               }}
//             />
//             <div style={{ position: "absolute", textAlign: "center" }}>
//               <Typography
//                 variant="h4"
//                 gutterBottom
//                 sx={{
//                   m: 0,
//                   color: "white",
//                   textAlign: "center",
//                   fontSize: { xs: "16px", sm: "22px", md: "28px", lg: "34px" },
//                 }}
//               >
//                 Camera
//               </Typography>
//               <Button
//                 onClick={() => {
//                   navigate("/Category/Camera");
//                 }}
//                 sx={{
//                   borderBottom: "2px solid white",
//                   color: "white",
//                   fontSize: { xs: "8px", sm: "10px", md: "12px", lg: "14px" },
//                 }}
//                 variant="text"
//               >
//                 Buy Now
//               </Button>
//             </div>
//           </div>
//           <div
//             className="image"
//             style={{ paddingBottom: "4px", paddingRight: "4px" }}
//           >
//             <Box
//               component="img"
//               src="https://static-01.daraz.pk/p/04b3c3f1c80194a1e0cc41623b386487.jpg"
//               sx={{
//                 height: { xs: "15vh", sm: "30vh", md: "35vh", lg: "50vh" },
//                 width: "100%",
//                 cursor: "pointer",
//                 borderRadius: "15px",
//               }}
//             />
//             <div style={{ position: "absolute", textAlign: "center" }}>
//               <Typography
//                 variant="h4"
//                 gutterBottom
//                 sx={{
//                   m: 0,
//                   color: "white",
//                   textAlign: "center",
//                   fontSize: { xs: "16px", sm: "22px", md: "28px", lg: "34px" },
//                 }}
//               >
//                 Combo
//               </Typography>
//               <Button
//                 onClick={() => {
//                   navigate("/Category/Combo");
//                 }}
//                 sx={{
//                   fontSize: { xs: "8px", sm: "10px", md: "12px", lg: "14px" },
//                   borderBottom: "2px solid white",
//                   color: "white",
//                 }}
//                 variant="text"
//               >
//                 Buy Now
//               </Button>
//             </div>
//           </div>
//         </Grid>
//         <Grid item xs={3}>
//           <div className="image" style={{}}>
//             <Box
//               component="img"
//               src="/Phone.PNG"
//               // sx={{ height: { lg: 580 }, width: { lg: 440 } }}
//               sx={{
//                 height: { xs: "30vh", sm: "60vh", md: "70vh", lg: "100vh" },
//                 width: "100%",
//                 cursor: "pointer",
//                 borderRadius: "15px",
//               }}
//             />
//             <div style={{ position: "absolute", textAlign: "center" }}>
//               <Typography
//                 variant="h4"
//                 gutterBottom
//                 sx={{
//                   m: 0,
//                   color: "white",
//                   textAlign: "center",
//                   fontSize: { xs: "16px", sm: "22px", md: "28px", lg: "34px" },
//                 }}
//               >
//                 Phone
//               </Typography>
//               <Button
//                 onClick={() => {
//                   navigate("/Category/Phone");
//                 }}
//                 sx={{
//                   fontSize: { xs: "8px", sm: "10px", md: "12px", lg: "14px" },
//                   borderBottom: "2px solid white",
//                   color: "white",
//                 }}
//                 variant="text"
//               >
//                 Buy Now
//               </Button>
//             </div>
//           </div>
//         </Grid>
//         <Grid item xs={6}>
//           <div className="image" style={{ paddingBottom: "4px" }}>
//             <Box
//               component="img"
//               src="https://img.freepik.com/premium-photo/black-wireless-headphones-isolated-black-background_95544-15.jpg"
//               sx={{
//                 height: { xs: "15vh", sm: "30vh", md: "35vh", lg: "50vh" },
//                 width: "50%",
//                 paddingRight: "4px",
//                 paddingLeft: "4px",
//                 cursor: "pointer",
//                 borderRadius: "15px",
//               }}
//             />
//             <Box
//               component="img"
//               src="https://images.unsplash.com/photo-1525373698358-041e3a460346?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8ZGFyayUyMGxhcHRvcHxlbnwwfHwwfHx8MA%3D%3D"
//               sx={{
//                 height: { xs: "15vh", sm: "30vh", md: "35vh", lg: "50vh" },
//                 width: "50%",
//                 cursor: "pointer",
//                 borderRadius: "15px",
//               }}
//             />
//             <div
//               style={{
//                 width: "50%",
//                 position: "absolute",
//                 textAlign: "center",
//                 display: "flex",
//                 justifyContent: "space-around",
//               }}
//             >
//               <div style={{ width: "25%" }}>
//                 <Typography
//                   variant="h4"
//                   gutterBottom
//                   sx={{
//                     m: 0,
//                     color: "white",
//                     textAlign: "center",
//                     fontSize: {
//                       xs: "16px",
//                       sm: "22px",
//                       md: "28px",
//                       lg: "34px",
//                     },
//                   }}
//                 >
//                   Headset
//                 </Typography>
//                 <Button
//                   onClick={() => {
//                     navigate("/Category/Headphones");
//                   }}
//                   sx={{
//                     fontSize: { xs: "8px", sm: "10px", md: "12px", lg: "14px" },
//                     borderBottom: "2px solid white",
//                     color: "white",
//                   }}
//                   variant="text"
//                 >
//                   Buy Now
//                 </Button>
//               </div>
//               <div style={{ width: "25%" }}>
//                 <Typography
//                   variant="h4"
//                   gutterBottom
//                   sx={{
//                     m: 0,
//                     color: "white",
//                     textAlign: "center",
//                     fontSize: {
//                       xs: "16px",
//                       sm: "22px",
//                       md: "28px",
//                       lg: "34px",
//                     },
//                   }}
//                 >
//                   Laptops
//                 </Typography>
//                 <Button
//                   onClick={() => {
//                     navigate("/Category/Laptops");
//                   }}
//                   sx={{
//                     fontSize: { xs: "8px", sm: "10px", md: "12px", lg: "14px" },
//                     borderBottom: "2px solid white",
//                     color: "white",
//                   }}
//                   variant="text"
//                 >
//                   Buy Now
//                 </Button>
//               </div>
//             </div>
//           </div>
//           <div className="image" style={{ paddingLeft: "4px" }}>
//             <Box
//               component="img"
//               src="https://png.pngtree.com/background/20230527/original/pngtree-monitor-with-black-backgrounds-and-black-reflections-picture-image_2762500.jpg"
//               sx={{
//                 height: { xs: "15vh", sm: "30vh", md: "35vh", lg: "50vh" },
//                 width: "100%",
//                 cursor: "pointer",
//                 borderRadius: "15px",
//               }}
//             />
//             <div style={{ position: "absolute", textAlign: "center" }}>
//               <Typography
//                 variant="h4"
//                 gutterBottom
//                 sx={{
//                   m: 0,
//                   color: "white",
//                   textAlign: "center",
//                   fontSize: { xs: "16px", sm: "22px", md: "28px", lg: "34px" },
//                 }}
//               >
//                 Monitors
//               </Typography>
//               <Button
//                 onClick={() => {
//                   navigate("/Category/Monitors");
//                 }}
//                 sx={{
//                   fontSize: { xs: "8px", sm: "10px", md: "12px", lg: "14px" },
//                   borderBottom: "2px solid white",
//                   color: "white",
//                 }}
//                 variant="text"
//               >
//                 Buy Now
//               </Button>
//             </div>
//           </div>
//         </Grid>
//       </Grid>
//     </>
//   );
// }

// import React from "react";
// import {
//   Box,
//   Card,
//   CardContent,
//   CardMedia,
//   Typography,
//   Grid,
// } from "@mui/material";

// const ProductGrid = () => {
//   const products = [
//     {
//       id: 1,
//       title: "iPhones",
//       brand: "Apple",
//       image:
//         "https://regen.pk/cdn/shop/files/REGEN-iPhone16-White.png?v=1735555022&width=1400",
//       isLarge: true,
//     },
//     {
//       id: 2,
//       title: "Galaxy Phones",
//       brand: "Samsung",
//       image:
//         "https://img.freepik.com/premium-photo/black-wireless-headphones-isolated-black-background_95544-15.jpg",
//     },
//     {
//       id: 3,
//       title: "Macs",
//       brand: "Apple",
//       image:
//         "https://regen.pk/cdn/shop/files/REGEN-Macbook-pro-m1-2020-topview.png?v=1682403635&width=1400",
//     },
//     {
//       id: 4,
//       title: "iPads",
//       brand: "Apple",
//       image:
//         "https://image-us.samsung.com/SamsungUS/home/computing/monitors/gaming/04162024/LS49CG954SNXZA_V2.jpg",
//     },
//     {
//       id: 5,
//       title: "Watches",
//       brand: "Apple",
//       image:
//         "https://www.ivpic.com/wp-content/uploads/2023/03/canon-5d-mark-iv-dslr.jpg",
//     },
//   ];

//   return (
//     <Box sx={{ flexGrow: 1, p: 2 }}>
//       <Grid container spacing={2}>
//         {/* Large iPhone Card */}
//         <Grid item xs={12} md={6} lg={6}>
//           <Card
//             sx={{
//               height: "100%",
//               display: "flex",
//               flexDirection: "column",
//               position: "relative",
//             }}
//           >
//             <CardMedia
//               component="img"
//               image={products[0].image}
//               alt={products[0].title}
//               sx={{
//                 height: { xs: "300px", sm: "400px", md: "600px" },
//                 objectFit: "cover",
//               }}
//             />
//             <CardContent
//               sx={{
//                 position: "absolute",
//                 bottom: 0,
//                 width: "100%",
//                 bgcolor: "rgba(255, 255, 255, 0.9)",
//               }}
//             >
//               <Typography variant="overline" component="div">
//                 {products[0].brand}
//               </Typography>
//               <Typography variant="h5" component="div">
//                 {products[0].title}
//               </Typography>
//             </CardContent>
//           </Card>
//         </Grid>

//         {/* Right side grid */}
//         <Grid item xs={12} md={6} lg={6}>
//           <Grid container spacing={2}>
//             {products.slice(1).map((product) => (
//               <Grid item xs={12} sm={6} key={product.id}>
//                 <Card sx={{ height: "100%" }}>
//                   <CardMedia
//                     component="img"
//                     image={product.image}
//                     alt={product.title}
//                     sx={{
//                       height: { xs: "200px", sm: "220px", md: "240px" },
//                       objectFit: "cover",
//                     }}
//                   />
//                   <CardContent>
//                     <Typography variant="overline" component="div">
//                       {product.brand}
//                     </Typography>
//                     <Typography variant="h6" component="div">
//                       {product.title}
//                     </Typography>
//                   </CardContent>
//                 </Card>
//               </Grid>
//             ))}
//           </Grid>
//         </Grid>
//       </Grid>
//     </Box>
//   );
// };

// export default ProductGrid;

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
        "https://pisces.bbystatic.com/image2/BestBuy_US/dam/sml_6544291-ref-1686111-1013-der-d363a249-c422-41e9-9bbe-e25dcb2fc60a.jpg;maxHeight=350;maxWidth=1000?format=webp",
      navigation: "/Category/Monitors",
    },
    {
      id: 5,
      title: "Camera",
      brand: "Canon",
      image:
        "https://www.ivpic.com/wp-content/uploads/2023/03/canon-5d-mark-iv-dslr.jpg",
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
                  height: { xs: "300px", sm: "400px", md: "600px" },
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
                        height: { xs: "200px", sm: "220px", md: "250px" }, // Adjust height to fit better
                        width: "100%",
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
