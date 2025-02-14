import * as React from "react";
import { useState, useEffect } from "react";
import "./carousal.css";
import {
  Box,
  Button,
  Container,
  Divider,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import ArrowBackIosNewSharpIcon from "@mui/icons-material/ArrowBackIosNewSharp";
import Carousel from "react-material-ui-carousel";

function Carousal() {
  var items = [
    {
      source: "/Screenshot1.png",
    },
    {
      source: "/Screenshot2.png",
    },
    {
      source: "/Screenshot3.png",
    },
    {
      source: "/Screenshot4.png",
    },
    {
      source: "/Screenshot5.png",
    },
    {
      source: "/Screenshot6.png",
    },
  ];

  return (
    <>
      {/* <Container> */}
      <div
        className="bg"
        style={{
          height: "80vh",
          display: "flex",
          justifyContent: "center",
          marginBottom: "50px",
        }}
      >
        <div style={{ marginTop: "70px" }}>
          <div style={{ textAlign: "center" }}>
            <img src="/device.png" alt="" style={{ width: "30%" }} />
          </div>
          <div style={{ textAlign: "center" }}>
            <Typography
              variant="h2"
              gutterBottom
              sx={{
                fontSize: { xs: "30px", sm: "40px", md: "50px", lg: "60px" },
              }}
            >
              Certified Pre Owned
            </Typography>
            <Typography
              variant="h2"
              gutterBottom
              sx={{
                fontSize: { xs: "30px", sm: "40px", md: "50px", lg: "60px" },
              }}
            >
              Devices
            </Typography>
            <Typography
              variant="h6"
              gutterBottom
              sx={{
                fontWeight: 200,
              }}
            >
              With 1-2 Years Warranty and 7-Day returns!
            </Typography>
          </div>
          <div style={{ textAlign: "center" }}>
            <Button
              variant="text"
              sx={{
                borderBottom: "2px solid black",
                color: "black",
              }}
            >
              Buy Now
            </Button>
          </div>
        </div>
      </div>
      <div className="video">
        <div>
          <Typography
            variant="h6"
            gutterBottom
            sx={{
              textAlign: "center",
              fontFamily: "monospace",
              fontSize: { xs: "14px", sm: "16px", md: "18x", lg: "20px" },
            }}
          >
            CHOOSE FROM
          </Typography>
          <Typography
            variant="h3"
            gutterBottom
            sx={{
              textAlign: "center",
              fontSize: { xs: "33px", sm: "38px", md: "43px", lg: "48px" },
            }}
          >
            The Best
          </Typography>
        </div>
        <div
          style={{ width: "100%", display: "flex", justifyContent: "center" }}
        >
          {/* <video
            src="/public/Computer.mp4"
            style={{ width: "80%" }}
            autoPlay
            playsinline
            muted
            loop
          ></video> */}
          <Carousel duration={2000} autoPlay={true} sx={{ width: "80%" }}>
            {items.map((item, i) => (
              <img
                key={i}
                src={item.source}
                style={{ width: "100%", height: "100%" }}
              />
            ))}
          </Carousel>
        </div>
      </div>
    </>
  );
}

export default Carousal;
