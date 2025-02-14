import React from "react";
import Productall from "./Productall";
import Carousal from "../../Components/Carousal/Carousal";
import { Grid } from "@mui/material";
import Category from "../../Components/category/Category";

export default function Homepage() {
  return (
    <>
      <Carousal />
      
      <Category />
      
    </>
  );
}
