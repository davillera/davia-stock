import {Entity, PrimaryGeneratedColumn, Column, ManyToMany} from "typeorm";
import { Product } from "./Product";

@Entity()
export class Category {
	@PrimaryGeneratedColumn("uuid")
	id!: string;

	@Column({ unique: true })
	name!: string;

	@Column({ nullable: true })
	description!: string;

	@ManyToMany(() => Product, product => product.categories)
	products!: Product[];
}
