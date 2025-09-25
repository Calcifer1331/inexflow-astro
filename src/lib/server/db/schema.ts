import { mysqlTable, varchar, mysqlEnum, decimal, boolean, datetime, smallint, primaryKey, char, bigint, date } from 'drizzle-orm/mysql-core'; // Asegúrate de que la ruta sea correcta
import { type InferSelectModel, type InferInsertModel } from 'drizzle-orm';
import mysqlUUID from "./uuid"
import { randomUUID, type UUID } from 'node:crypto';

/**
 * Criterios SMART
 * 
 * Especificos: que se quiere lograr?
 * Medible: Como se sabra que se alcanzo?
 * Alcanzable: Es posible con los recursos?
 * Realista: responde a una necesidad?
 * Temporales: en que plazo se realizara?
 */


/**
 * La sintaxis de las tablas es el siguiente:
 * 
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
	// createdBy: mysqlUUID().references(() => user.id),
	// updatedBy: mysqlUUID().references(() => user.id),
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
export type UserRole = User['role'];
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
 * | id | name     | symbol | type   | businessId |
| -- | -------- | ------ | ------ | ---------- |
| 1  | kilogram | kg     | weight | null       |
| 2  | liter    | L      | volume | null       |
| 3  | unidad   | ud     | unit   | null       |
| 4  | paquete  | pqt    | unit   | b1-uuid    |
| id | name      | type    | cost  | stock | measureUnitId |
| -- | --------- | ------- | ----- | ----- | ------------- |
| 1  | Harina    | supply  | 25.00 | 100   | 1 (kg)        |
| 2  | Leche     | supply  | 0.90  | 200   | 2 (L)         |
| 3  | Pan       | product | 0.10  | 500   | 3 (ud)        |
| 4  | Tornillos | supply  | 3.00  | 50    | 4 (pqt)       |

 */
export const measureUnit = mysqlTable('measure_units', {
	id: bigint({ mode: 'number', unsigned: true }).autoincrement().primaryKey(),
	name: varchar({ length: 255 }).notNull(),
	symbol: varchar({ length: 50 }).notNull(),
	type: mysqlEnum(['weight', 'volume', 'length', 'area', 'time', 'unit', 'currency']).notNull(),
	...auditableFields,
	...tenantFields
});


export type MeasureUnit = InferSelectModel<typeof measureUnit>;
export type NewMeasureUnit = InferInsertModel<typeof measureUnit>;

/**
 * Productos y Suministros del negocio
 */
export const item = mysqlTable('items', {
	id: bigint({ mode: 'number', unsigned: true }).autoincrement().primaryKey(),
	name: varchar({ length: 255 }).notNull(),
	type: mysqlEnum(['product', 'supply']).default('product').notNull(),
	cost: decimal({ scale: 2, precision: 10, unsigned: true, }).default('0.00').notNull(),
	sellingPrice: decimal({ scale: 2, precision: 10, unsigned: true, }),
	stock: decimal({ precision: 10, scale: 3, unsigned: true }).default('0.000').notNull(),
	minStock: decimal({ precision: 10, scale: 3, unsigned: true }).default('0.000').notNull(),
	measureUnitId: bigint({ mode: 'number', unsigned: true }).notNull().references(() => measureUnit.id, { onDelete: 'cascade' }),
	...auditableFields,
	...tenantFields
});

export type Item = InferSelectModel<typeof item>;
export type ItemType = Item['type'];
export type NewItem = InferInsertModel<typeof item>;
export type EditItem = Partial<Pick<Item, 'cost' | 'measureUnitId' | 'minStock' | 'name' | 'stock' | 'sellingPrice'>>

/**
 * Servicios del negocio, tanto los que se venden a los clientes (limpieza de carro, masage) hasta los que se compran a proveeores (luz, agua, gas, limpieza de aire).
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
 * Categorias.
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
 * Relacion de categorie y item. fix: debe de haber una para servicios.
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
 * Receta de productos, un producto puede tener uno o muchos ingredientes, fix: me parece que esta mal, tiene que ser la receta para un producto y en otra tabla la relacion de cada ingrediente. 
 * 
 * Producto (Pan) → insumos: harina, leche, levadura.
 * Servicio (Cambio de aceite en taller) → insumos: aceite, filtro.
 * Servicio (Limpieza de oficina) → insumos: detergente, bolsas de basura; incluso podría incluir otro servicio tercerizado (fumigación).
 */
export const recipe = mysqlTable('recipes', {
	id: bigint({ mode: 'number', unsigned: true }).autoincrement().primaryKey(),
	// Puede ser producto o servicio
	outputType: mysqlEnum(['item', 'service']).notNull(),
	outputId: bigint({ mode: 'number', unsigned: true }).notNull(),
	// Relación polimórfica: depende de outputType (item.id o service.id)
	...auditableFields,
	...tenantFields,
});

export const recipeComponent = mysqlTable('recipe_components', {
	id: bigint({ mode: 'number', unsigned: true }).autoincrement().primaryKey(),
	recipeId: bigint({ mode: 'number', unsigned: true })
		.notNull()
		.references(() => recipe.id, { onDelete: 'cascade' }),

	// El insumo también puede ser item o servicio
	inputType: mysqlEnum(['item', 'service']).notNull(),
	inputId: bigint({ mode: 'number', unsigned: true }).notNull(),

	// Cantidad requerida
	quantity: decimal({ precision: 10, scale: 3, unsigned: true }).notNull(),

	...auditableFields,
	...tenantFields,
});


export type Recipe = InferSelectModel<typeof recipe>;
export type NewRecipe = InferInsertModel<typeof recipe>;

/**
 * Contactos de los negocios, clientes o proveedores.
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
 * Transacciones de compra de suministros y servicios y ventas de prouctos y servicions.
 */
export const transaction = mysqlTable('transactions', {
	id: bigint({ mode: 'number', unsigned: true }).autoincrement().primaryKey(),
	number: varchar({ length: 50 }).notNull(),
	contactId: bigint({ mode: 'number', unsigned: true }).references(() => contact.id, { onDelete: 'cascade' }),
	paymentStatus: mysqlEnum(['paid', 'pending', 'overdue', 'cancelled']).default('paid').notNull(),
	description: varchar({ length: 255 }),
	type: mysqlEnum([
		'purchase_supply',   // compras de insumos (afecta stock)
		'purchase_service',  // compras de servicios (no afecta stock)
		'sale_product',      // venta de productos (afecta stock)
		'sale_service',      // venta de servicios (puede consumir insumos)
		'production',        // manufactura (convierte insumos en productos)
	]).notNull(),
	dueDate: datetime({ mode: 'date' }).notNull(),
	total: decimal({ precision: 10, scale: 2, unsigned: true }).notNull(),

	...auditableFields,
	...tenantFields,
});


export type Transaction = InferSelectModel<typeof transaction>;
export type NewTransaction = InferInsertModel<typeof transaction>;

/**
 * Entrada de transaccion, actualmente esta pensado para productos
 */
export const record = mysqlTable('transaction_details', {
	id: bigint({ mode: 'number', unsigned: true }).autoincrement().primaryKey(),
	transactionId: bigint({ mode: 'number', unsigned: true })
		.notNull()
		.references(() => transaction.id, { onDelete: 'cascade' }),

	itemId: bigint({ mode: 'number', unsigned: true }).notNull(),

	// Datos históricos del item en el momento de la transacción:
	itemName: varchar({ length: 255 }).notNull(),
	measureUnitName: varchar({ length: 50 }).notNull(),
	measureUnitSymbol: varchar({ length: 10 }).notNull(),

	// Transacción en sí:
	quantity: decimal({ precision: 10, scale: 3, unsigned: true }).notNull(),
	unitPrice: decimal({ precision: 12, scale: 2, unsigned: true }).notNull(),
	total: decimal({ precision: 14, scale: 2, unsigned: true }).notNull(),

	...auditableFields,
	...tenantFields
});

export type Record = InferSelectModel<typeof record>;
export type NewRecord = InferInsertModel<typeof record>;

/**
 * Pagos - son pagos realizados a transacciones que pueden ser de compras o ventans, fix: referencia a contacto
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