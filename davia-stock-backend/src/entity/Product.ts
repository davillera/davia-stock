import {Entity, PrimaryGeneratedColumn, Column, JoinTable, ManyToMany} from "typeorm";
import { Category } from "./Category";

@Entity()
export class Product {
	@PrimaryGeneratedColumn("uuid")
	id!: string;

	@Column()
	name!: string;

	@Column("decimal", { precision: 10, scale: 2 })
	price!: number;

	@Column({ nullable: true })
	quantity!: number;

	@Column({ nullable: true })
	description!: string;

	@ManyToMany(() => Category, category => category.products)
	@JoinTable()
	categories!: Category[];
}
