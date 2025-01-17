import { Router } from "express";
import {createProduct} from "../controllers/product";


const router = Router();

router.post('/product', async (req, res) => {
	try {
		await createProduct(req, res);
	} catch (error) {
		res.status(500).json({ message: "Error al crear el Producto", error });
	}
});