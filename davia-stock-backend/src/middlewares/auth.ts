import {NextFunction, Request, Response} from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET

export interface AuthRequest extends Request {
	user?: any;
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
	const authHeader = req.headers.authorization;

	if (!authHeader || !authHeader.startsWith("Bearer ")) {
		return res.status(401).json({ message: "Token de autenticación no proporcionado" });
	}

	const token = authHeader.split(" ")[1];

	if(!JWT_SECRET) {
		return res.status(500).json({ message: "Error en el JWT_SECRET" });
	}

	try {
		req.user = jwt.verify(token, JWT_SECRET);
		next();
	} catch (error) {
		return res.status(401).json({ message: "Token no válido" });
	}
};