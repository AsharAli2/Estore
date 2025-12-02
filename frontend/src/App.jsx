import "./App.css";
import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
const Product = lazy(() => import("./Pages/Product/Product"));
import { CartContainer } from "./context/Cartcontext";
const Cart = lazy(() => import("./Pages/Cart/Cart"));
const Addprod = lazy(() => import("./Pages/AddProduct/Addprod"));

import { ProductContainer } from "./context/ProductContext";
import Admin from "./Pages/Admin/Admin";
import UserReviews from "./Pages/history/Reviews";
import Chatbot from "./Components/Chatbot/Chatbot";
const LoginPage = lazy(() => import("./Pages/Login/LoginPage"));
const Editprod = lazy(() => import("./Pages/EditProduct/Editprod"));
const RegisterPage = lazy(() => import("./Pages/Register/RegisterPage"));

const History = lazy(() => import("./Pages/history/History"));
const ProductsList = lazy(() => import("./Pages/Products/ProductsList"));
const Dashboard = lazy(() => import("./Pages/Admin/Dashboard"));
const Users = lazy(() => import("./Pages/Admin/Users"));
const Products = lazy(() => import("./Pages/Admin/Products"));
const Navbar = lazy(() => import("./Components/Navbar/Navbar"));
const ScrolltoTop = lazy(() => import("./Components/ScrolltoTop/ScrolltoTop"));

function App() {
  return (
    <>
      <BrowserRouter>
        <CartContainer>
          <ProductContainer>
            <Navbar />
            <Suspense>
              <ScrolltoTop />
              <Routes>
                {/* Redirect root to products listing */}
                <Route path="/" element={<Navigate to="/Products" replace />} />
                {/* Root homepage route removed as requested */}
                <Route path="/UserHistory/:userName" element={<History />} />
                <Route path="/Reviews/:userName" element={<UserReviews />} />
                <Route path="/Product/:id" element={<Product />} />
                <Route path="/Cart" element={<Cart />} />
                <Route path="/Product/edit/:id" element={<Editprod />} />
                <Route path="/addproduct" element={<Addprod />} />
                <Route path="/Login" element={<LoginPage />} />
                <Route path="/Signup" element={<RegisterPage />} />
                <Route path="/Products" element={<ProductsList />} />

                <Route path="/Admin/Dashboard" element={<Dashboard />} />
                <Route path="/Admin/Users" element={<Users />} />
                <Route path="/Admin/Products" element={<Products />} />
                <Route path="/Administrator" element={<Admin />} />
              </Routes>
            </Suspense>
            <Chatbot />
          </ProductContainer>
        </CartContainer>
      </BrowserRouter>
    </>
  );
}

export default App;
