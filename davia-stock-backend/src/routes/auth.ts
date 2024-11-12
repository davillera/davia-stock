import { Router } from "express";
import {changePassword, login, register} from "../controllers/auth";

const router = Router();

router.post('/login', async (req, res) => {
	try {
		await login(req, res);
	} catch (error) {
		res.status(500).json({ message: "Error al iniciar sesión", error });
	}
});
router.post('/register', async (req, res) => {
	try{
		await register(req, res);
	}catch (error) {
		res.status(500).json({ message: "Error al registrar el usuario.", error });
	}
});

router.post('/changepassword', async (req, res) => {
	try{
		await changePassword(req, res);
	}catch (error) {
		res.status(500).json({ message: "Error al cambiar contraseña.", error });
	}
});

export default router;
