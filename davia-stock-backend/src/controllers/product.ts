import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { Product } from "../entity/Product";
import { Category } from "../entity/Category";
import { In } from "typeorm";

export const createProduct = async (req: Request, res: Response) => {
	try {
		const { name, price, description, categoryIds } = req.body;

		const productRepository = AppDataSource.getRepository(Product);
		const categoryRepository = AppDataSource.getRepository(Category);
		const categories = await categoryRepository.findBy({
			id: In(categoryIds),
		});

		const newProduct = new Product();
		newProduct.name = name;
		newProduct.price = price;
		newProduct.description = description;
		newProduct.categories = categories;

		await productRepository.save(newProduct);

		return res.status(201).json(newProduct);
	} catch (error) {
		return res.status(500).json({ message: "Error al crear el producto", error });
	}
};
