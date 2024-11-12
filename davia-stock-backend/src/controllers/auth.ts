import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { User } from "../entity/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

export const register = async (req: Request, res: Response): Promise<Response> => {
	const { email, password } = req.body;

	if (!email || !password) {
		return res.status(400).json({ message: "Email y contraseña son requeridos." });
	}

	const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
	if (!emailRegex.test(email)) {
		return res.status(400).json({ message: "El correo electrónico no es válido." });
	}

	if (password.length < 6) {
		return res.status(400).json({ message: "La contraseña debe tener al menos 6 caracteres." });
	}

	try {
		const userRepository = AppDataSource.getRepository(User);
		const existingUser = await userRepository.findOneBy({ email });

		if (existingUser) {
			return res.status(409).json({ message: "Este Usuario ya existe" });
		}

		const hashedPassword = await bcrypt.hash(password, 10);
		const newUser = new User();
		newUser.email = email;
		newUser.password = hashedPassword;

		await userRepository.save(newUser);

		return res.status(201).json({
			message: "Usuario Registrado Correctamente",
		});
	} catch (error) {
		return res.status(500).json({ message: "Error al registrar el usuario.", error });
	}
};

export const login = async (req: Request, res: Response): Promise<Response> => {
	const { email, password } = req.body;

	if (!email || !password) {
		return res.status(400).json({
			message: "Email y contraseña son requeridos."
		});
	}

	try {
		const userRepository = AppDataSource.getRepository(User);
		const user = await userRepository.findOne({ where: { email } });

		if (!user) {
			return res.status(401).json({
				message: "El usuario no existe."
			});
		}

		const isPasswordValid = await bcrypt.compare(password, user.password);
		if (!isPasswordValid) {
			return res.status(401).json({ message: "Contraseña incorrecta." });
		}

		const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "1h" });

		return res.status(200).json({ message: "Login exitoso", token });
	} catch (error) {
		return res.status(500).json({ message: "Error al autenticar al usuario.", error });
	}
};

export const changePassword = async (req: Request, res: Response) => {

	const { email, oldPassword, newPassword } = req.body;

	if (!oldPassword || !newPassword) {
		return res.status(400).json({ message: "La contraseña actual y la nueva son requeridas." });
	}

	if (newPassword.length < 6) {
		return res.status(400).json({ message: "La nueva contraseña debe tener al menos 6 caracteres." });
	}
	
	try{
		const userRepository = AppDataSource.getRepository(User);
		const user = await userRepository.findOne({ where: { email } });

		if (!user) {
			return res.status(401).json({
				message: "El usuario no existe."
			});
		}

		const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);

		if (!isOldPasswordValid) {
			return res.status(401).json({ message: "La contraseña actual es incorrecta." });
		}

		user.password = await bcrypt.hash(newPassword, 10);
		await userRepository.save(user);

		return res.status(200).json({ message: "Contraseña actualizada correctamente." });

	} catch (error){
		return res.status(500).json({ message: "Error al cambiar la contraseña.", error });
	}
}
