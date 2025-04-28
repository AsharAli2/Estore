import { Box, Card, CardContent, Grid, Typography } from "@mui/material";
import React, { useState } from "react";
import Admin from "./Admin";
import WavingHandIcon from "@mui/icons-material/WavingHand";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import { BarChart } from "@mui/x-charts/BarChart";
import { LineChart, axisClasses } from "@mui/x-charts";
// import { fontGrid } from "@mui/material/styles/cssUtils";

export default function Dashboard() {
  const chartSetting = {
    yAxis: [
      {
        // label: "Profit ($)",

        tickLabelStyle: {
          fontSize: 19,
        },
      },
    ],

    sx: {
      [`.${axisClasses.left} .${axisClasses.label}`]: {
        transform: "translate(-20px, 0)",
      },
      "& .MuiChartsAxis-bottom .MuiChartsAxis-line": {
        stroke: "#0000FF",
        strokeWidth: 0.9,
      },
      // leftAxis Line Styles
      "& .MuiChartsAxis-left .MuiChartsAxis-line": {
        stroke: "#00000FF",
        strokeWidth: 0.9,
      },
    },
  };
  const dataset = [
    {
      london: 1000,

      month: "Jan",
    },
    {
      london: 2000,

      month: "Feb",
    },
    {
      london: 4000,

      month: "Mar",
    },
    {
      london: 8000,

      month: "Apr",
    },
    {
      london: 9000,

      month: "May",
    },
    {
      london: 7500,

      month: "June",
    },
    {
      london: 8600,

      month: "July",
    },
    {
      london: 6500,

      month: "Aug",
    },
    {
      london: 7900,

      month: "Sept",
    },
    {
      london: 9100,

      month: "Oct",
    },
    {
      london: 9900,

      month: "Nov",
    },
    {
      london: 11500,

      month: "Dec",
    },
  ];
  const valueFormatter = (value) => `${value}$`;

  return (
    <>
      <Grid
        container
        spacing={2}
        sx={{ height: "100%", width: "100%", margin: "0px" }}
      >
        <Grid
          item
          xs={12}
          sm={12}
          md={2}
          sx={{
            padding: "0px !important",
            textAlign: "center",
            height: { xs: "auto", sm: "auto", md: "100vh" },
            position: { md: "sticky" },
            top: { md: "0" },
            backgroundColor: "#101A32",
          }}
        >
          <Admin />
        </Grid>

        <Grid
          item
          xs={12}
          sm={12}
          md={10}
          sx={{ backgroundColor: "whitesmoke" }}
        >
          <Box sx={{ marginBottom: "10px" }}>
            <Typography variant="h4">
              Hi, Welcome Back <WavingHandIcon sx={{ color: "blue" }} />
            </Typography>
          </Box>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "25px",
            }}
          >
            <Card sx={{ width: "250px", height: "150px" }}>
              <CardContent>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-around",
                    alignItems: "center",
                    marginBottom: "20px",
                  }}
                >
                  <BusinessCenterIcon
                    sx={{
                      fontSize: "50px",
                      color: "green",
                    }}
                  />
                  <Typography variant="h4" sx={{ fontFamily: "cursive" }}>
                    90
                  </Typography>
                </div>
                <div>
                  <Typography
                    variant="h6"
                    textAlign={"center"}
                    sx={{ fontFamily: "sans-serif" }}
                  >
                    Total Products
                  </Typography>
                </div>
              </CardContent>
            </Card>
            <Card sx={{ width: "250px", height: "150px" }}>
              <CardContent>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-around",
                    alignItems: "center",

                    marginBottom: "20px",
                  }}
                >
                  <PeopleAltIcon
                    sx={{ fontSize: "50px", color: "lightskyblue" }}
                  />
                  <Typography variant="h4" sx={{ fontFamily: "cursive" }}>
                    90
                  </Typography>
                </div>
                <div>
                  <Typography
                    variant="h6"
                    textAlign={"center"}
                    sx={{ fontFamily: "sans-serif" }}
                  >
                    Total Users
                  </Typography>
                </div>
              </CardContent>
            </Card>
            <Card sx={{ width: "250px", height: "150px" }}>
              <CardContent>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-around",
                    alignItems: "center",

                    marginBottom: "20px",
                  }}
                >
                  <ShoppingCartCheckoutIcon
                    sx={{ fontSize: "50px", color: "orange" }}
                  />
                  <Typography variant="h4" sx={{ fontFamily: "cursive" }}>
                    90
                  </Typography>
                </div>
                <div>
                  <Typography
                    variant="h6"
                    textAlign={"center"}
                    sx={{ fontFamily: "sans-serif" }}
                  >
                    Total Orders
                  </Typography>
                </div>
              </CardContent>
            </Card>
            <Card sx={{ width: "250px", height: "150px" }}>
              <CardContent>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-around",
                    alignItems: "center",

                    marginBottom: "20px",
                  }}
                >
                  <MonetizationOnIcon
                    sx={{ fontSize: "50px", color: "purple" }}
                  />
                  <Typography variant="h4" sx={{ fontFamily: "cursive" }}>
                    90
                  </Typography>
                </div>
                <div>
                  <Typography
                    variant="h6"
                    textAlign={"center"}
                    sx={{ fontFamily: "sans-serif" }}
                  >
                    Total Profit
                  </Typography>
                </div>
              </CardContent>
            </Card>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "20px",
            }}
          >
            <LineChart
              dataset={dataset}
              xAxis={[
                {
                  scaleType: "band",
                  dataKey: "month",
                  tickLabelStyle: {
                    fontSize: 19,
                  },
                },
              ]}
              series={[
                {
                  curve: "linear",
                  dataKey: "london",
                  label: "Sales",
                  valueFormatter,
                  color: "blue",
                },
              ]}
              {...chartSetting}
              width={700}
              height={500}
            />
          </div>
        </Grid>
      </Grid>
    </>
  );
}
