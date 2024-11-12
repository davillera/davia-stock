import express from "express";
import mongoose from "mongoose";
import { AppDataSource } from "./config/data-source";
import authRoutes from "./routes/auth";
export const app = express();

app.use(express.json());

app.use("/auth", authRoutes);

AppDataSource.initialize().then(() => {
		console.log("Connected to PostgreSQL");
	}).catch((err) => {
		console.error("PostgreSQL connection error:", err);
	});

mongoose.connect(process.env.MONGO_URI as string).then(() => {
	console.log("Connected to MongoDB");
}).catch((err) => {
	console.error("MongoDB connection error:", err);
})