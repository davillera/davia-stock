import { Router } from "express";
import { login, register } from "../controllers/auth";

const router = Router();

router.post('/login', async (req, res) => {
	try {
		await login(req, res);
	} catch (error) {
		res.status(500).json({ message: "Error al registrar el usuario.", error });
	}
});
router.post('/register', async (req, res) => {
	try{
		await register(req, res);
	}catch (error) {
		res.status(500).json({ message: "Error al registrar el usuario.", error });
	}
});

export default router;
