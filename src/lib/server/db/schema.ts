import { mysqlTable, varchar, timestamp, mysqlEnum, decimal, json, boolean, datetime, smallint, tinyint, primaryKey, check, unique, index, char, serial, foreignKey, bigint, int, date } from 'drizzle-orm/mysql-core'; // Asegúrate de que la ruta sea correcta
import { type InferSelectModel, type InferInsertModel, sql, SQL, TableAliasProxyHandler } from 'drizzle-orm';
import mysqlUUID from "./uuid"
import { randomUUID, type UUID } from 'node:crypto';


/**
 * La sintaxis de las tablas es el siguiente:
 * 1. Nombre de constante, CamelCase/singular.
 * 2. Nombre de tabla, snake_case/plural.
 * 3. Nombre de campo, CamelCase/singular, automaticamente lo convertira en snake_case en el script.
 * 4. Nombre de constrains, dejar que el gestor la ponga, snake_case/plural.
 */


/**
 * Compos de auditoria
 * 
 * @property createdAt - asigna la fecha d ecreacion del elemento
 * @property updatedAt - cada vez que se actualiza el elemento se pone la fecha del momento
 * 
 */
export const auditableFields = {
	createdAt: datetime({ mode: 'date' }).notNull().$default(() => new Date()),
	updatedAt: datetime({ mode: 'date' }).notNull().$default(() => new Date()).$onUpdate(() => new Date()),
}

export const business = mysqlTable('businesses', {
	id: mysqlUUID().primaryKey().$default(() => randomUUID()),
	name: varchar({ length: 255 }).notNull(),
	phone: varchar({ length: 255 }).notNull(),
	...auditableFields
});

export type Business = InferSelectModel<typeof business>;
export type NewBusiness = InferInsertModel<typeof business>;

/**
 * Campo que divide las tablas de los negocios
 * @property businessId - Id del negocio al que pertenece
 */
export const tenantFields = {
	businessId: mysqlUUID().notNull().references(() => business.id, { onDelete: 'cascade' })
}
/**
 * usuarios del sistema
 */
export const user = mysqlTable('users', {
	id: mysqlUUID().primaryKey().$default(() => randomUUID()),
	name: varchar({ length: 255 }).notNull(),
	email: varchar({ length: 255 }).notNull(),
	passwordHash: char({ length: 60 }).notNull(),
	role: mysqlEnum(['admin', 'businessman']).default('businessman').notNull(),
	isActive: boolean().notNull().default(true),
	...auditableFields,
	...tenantFields
});

export type User = InferSelectModel<typeof user>;
export type NewUser = InferInsertModel<typeof user>;

export type UserSession = Pick<User, 'id' | 'email' | 'name' | 'isActive' | 'role' | 'businessId'>

type AdminSession = Pick<User, 'id' | 'email' | 'name' | 'isActive'> & {
	role: 'admin';
	businessId: null; // siempre null
};

type BusinessmanSession = Pick<User, 'id' | 'email' | 'name' | 'isActive'> & {
	role: 'businessman';
	businessId: UUID; // obligatorio
};

export type StrictUserSession = AdminSession | BusinessmanSession;

/**
 * Unidades de medidas del sistema
 */
export const measureUnit = mysqlTable('measure_units', {
	id: bigint({ mode: 'number', unsigned: true }).autoincrement().primaryKey(),
	value: varchar({ length: 255 }).notNull(),
});
export type MeasureUnit = InferSelectModel<typeof measureUnit>;
export type NewMeasureUnit = InferInsertModel<typeof measureUnit>;

/**
 * Productos/Suministros
 */
export const item = mysqlTable('items', {
	id: bigint({ mode: 'number', unsigned: true }).autoincrement().primaryKey(),
	name: varchar({ length: 255 }).notNull(),
	type: mysqlEnum(['product', 'supply']).default('product').notNull(),
	cost: decimal({ scale: 2, precision: 10, unsigned: true, }).default('0.00').notNull(),
	sellingPrice: decimal({ scale: 2, precision: 10, unsigned: true, }),
	stock: int({ unsigned: true }).default(0).notNull(),
	minStock: int({ unsigned: true }).default(10).notNull(),
	measureUnitId: bigint({ mode: 'number', unsigned: true }).notNull().references(() => measureUnit.id, { onDelete: 'cascade' }),
	...auditableFields,
	...tenantFields
});

export type Item = InferSelectModel<typeof item>;
export type ItemType = Item['type'];
export type NewItem = InferInsertModel<typeof item>;
export type EditItem = Partial<Pick<Item, 'cost' | 'measureUnitId' | 'minStock' | 'name' | 'stock' | 'sellingPrice'>>
/**
 * Servicios de entrada y salida
 */
export const service = mysqlTable('services', {
	id: bigint({ mode: 'number', unsigned: true }).autoincrement().primaryKey(),
	name: varchar({ length: 255 }).notNull(),
	type: mysqlEnum(['income', 'expense']).default('expense').notNull(),
	cost: decimal({ scale: 2, precision: 10, unsigned: true, }).default('0.00').notNull(),
	sellingPrice: decimal({ scale: 2, precision: 10, unsigned: true, }),
	measureUnitId: bigint({ mode: 'number', unsigned: true }).notNull().references(() => measureUnit.id, { onDelete: 'cascade' }),
	...auditableFields,
	...tenantFields
});

export type Service = InferSelectModel<typeof service>;
export type NewService = InferInsertModel<typeof service>;
/**
 * Servicios de entrada y salida
 */
export const categorie = mysqlTable('categories', {
	id: bigint({ mode: 'number', unsigned: true }).autoincrement().primaryKey(),
	name: varchar({ length: 255 }).notNull(),
	...auditableFields,
	...tenantFields
});

export type Categorie = InferSelectModel<typeof categorie>;
export type NewCategorie = InferInsertModel<typeof categorie>;

/**
 * Servicios de entrada y salida
 */
export const categorieItem = mysqlTable('categories_items', {
	categoryId: bigint({ mode: 'number', unsigned: true }).notNull().references(() => categorie.id, { onDelete: 'cascade' }),
	itemId: bigint({ mode: 'number', unsigned: true }).notNull().references(() => item.id, { onDelete: 'cascade' }),
	...auditableFields,
	...tenantFields
}, table => [
	primaryKey({ columns: [table.categoryId, table.itemId] }),
]);
export type categorieItem = InferSelectModel<typeof categorieItem>;
export type NewcategorieItem = InferInsertModel<typeof categorieItem>;
/**
 * Servicios de entrada y salida
 */
export const recipe = mysqlTable('recipes', {
	id: bigint({ mode: 'number', unsigned: true }).autoincrement().primaryKey(),
	product_id: bigint({ mode: 'number', unsigned: true }).notNull().references(() => item.id, { onDelete: 'cascade' }),
	ingredient_id: bigint({ mode: 'number', unsigned: true }).notNull().references(() => item.id, { onDelete: 'cascade' }),
	quantity: smallint({ unsigned: true }).notNull(),
	...auditableFields,
	...tenantFields
});

export type Recipe = InferSelectModel<typeof recipe>;
export type NewRecipe = InferInsertModel<typeof recipe>;

/**
 * Servicios de entrada y salida
 */
export const contact = mysqlTable('contacts', {
	id: bigint({ mode: 'number', unsigned: true }).autoincrement().primaryKey(),
	name: varchar({ length: 255 }).notNull(),
	email: varchar({ length: 255 }),
	phone: varchar({ length: 255 }),
	address: varchar({ length: 255 }),
	type: mysqlEnum(['customer', 'provider']).default('customer').notNull(),
	...auditableFields,
	...tenantFields
});
export type Contact = InferSelectModel<typeof contact>;
export type NewContact = InferInsertModel<typeof contact>;
/**
 * Servicios de entrada y salida
 */
export const transaction = mysqlTable('transactions', {
	id: bigint({ mode: 'number', unsigned: true }).autoincrement().primaryKey(),
	number: varchar({ length: 50 }).notNull(),
	contactId: bigint({ mode: 'number', unsigned: true }).references(() => contact.id, { onDelete: 'cascade' }),
	paymentStatus: mysqlEnum(['paid', 'pending', 'overdue', 'cancelled']).default('paid').notNull(),
	description: varchar({ length: 255 }).notNull(),
	type: mysqlEnum(['income', 'expense']).default('expense').notNull(),
	total: decimal({ scale: 2, precision: 10, unsigned: true, }).notNull(),
	dueDate: date(),
	...auditableFields,
	...tenantFields
});
export type Transaction = InferSelectModel<typeof transaction>;
export type NewTransaction = InferInsertModel<typeof transaction>;
/**
 * Servicios de entrada y salida
 */
export const record = mysqlTable('records', {
	id: bigint({ mode: 'number', unsigned: true }).autoincrement().primaryKey(),
	productId: bigint({ mode: 'number', unsigned: true }).notNull().references(() => item.id, { onDelete: 'cascade' }),
	transactionId: bigint({ mode: 'number', unsigned: true }).notNull().references(() => transaction.id, { onDelete: 'cascade' }),
	unitPrice: decimal({ scale: 2, precision: 10, unsigned: true, }).notNull(),
	quantity: smallint({ unsigned: true }).notNull(),
	subtotal: decimal({ scale: 2, precision: 10, unsigned: true, }).notNull(),
	...auditableFields,
	...tenantFields
});
export type Record = InferSelectModel<typeof record>;
export type NewRecord = InferInsertModel<typeof record>;
/**
 * Servicios de entrada y salida
 */
export const payment = mysqlTable('payments', {
	id: bigint({ mode: 'number', unsigned: true }).autoincrement().primaryKey(),
	transactionId: bigint({ mode: 'number', unsigned: true }).notNull().references(() => transaction.id, { onDelete: 'cascade' }),
	paymentMethod: mysqlEnum(['cash', 'card', 'transfer']).notNull(),
	amount: decimal({ scale: 2, precision: 10, unsigned: true, }).notNull(),
	...auditableFields,
	...tenantFields
});
export type Payment = InferSelectModel<typeof payment>;
export type NewPayment = InferInsertModel<typeof payment>;