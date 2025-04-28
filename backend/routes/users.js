
import express from "express";
import { UserModel } from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { protect } from "../middleware/auth.js";
import { Review } from "../models/Review.js";
const router = express.Router();
const saltRounds = 10;

router.post("/register", async (req, res) => {
   const userName = req.body.userName
   const password = req.body.password
   const Email = req.body.Email
   const Phone = req.body.Phone
   const Address = req.body.Address
   const userExist = await UserModel.findOne({ userName })
   if (userExist) {
      res.send({ message: "User name already taken" })
      return;
   }
   const HashedPassword = await bcrypt.hash(password, saltRounds)
   const userData = { userName, password: HashedPassword, Email, Phone, Address };

   const SavedUser = new UserModel(userData)
   const saved = await SavedUser.save()
   res.send({ user: saved, message: "User created" })
});




router.post("/login", async (req, res) => {
   const userName = req.body.userName
   const password = req.body.password
   const isUser = await UserModel.findOne({ userName })
   if (isUser) {
      const match = await bcrypt.compare(password, isUser.password)
      if (match) {
         const token = jwt.sign({ _id: isUser._id }, process.env.jwt_secret, { expiresIn: "30d" })
         res.send({ match, message: "Login Successfully", User: { isUser }, token })

      }
      else {
         res.send({ match, message: "Wrong Password" })
      }
   }
   else {
      res.send({ message: "No User Found" })
   }
});

router.get("/reviews/:userName", protect, async (req, res) => {
   try {
      const userName = req.params.userName; // Extract user ID from auth middleware

      // Fetch reviews along with product details (name and image)
      const reviews = await Review.find({ userName: userName })
         .populate("productId", "name image") // Only fetch product name and image
         .sort({ createdAt: -1 });

      res.json({ reviews });
   } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server Error" });
   }
});

export { router }