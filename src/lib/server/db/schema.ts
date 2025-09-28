import { mysqlTable, varchar, mysqlEnum, decimal, boolean, datetime, smallint, primaryKey, char, bigint, date, unique, mediumint } from 'drizzle-orm/mysql-core'; // Asegúrate de que la ruta sea correcta
import { type InferSelectModel, type InferInsertModel, sql, SQL } from 'drizzle-orm';
import mysqlUUID from "./uuid"
import { randomUUID, type UUID } from 'node:crypto';
import { bytes, check } from 'drizzle-orm/gel-core';

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
export const historicalFields = {
	createdAt: datetime({ mode: 'date' }).notNull().$default(() => new Date()),
	updatedAt: datetime({ mode: 'date' }).notNull().$default(() => new Date()).$onUpdate(() => new Date()),
}

/**
 * Compos de auditoria
 * 
 * @property createdAt - asigna la fecha d ecreacion del elemento
 * @property updatedAt - cada vez que se actualiza el elemento se pone la fecha del momento
 * @property createdBy - asigna el nombre del usuario que creo el elemento
 * @property updatedBy - cada vez que se actualiza el elemento se pone el identificador del usuario
 * 
 */

export const auditableFields = {
	...historicalFields,
	createdBy: varchar({ length: 255 }),
	updatedBy: varchar({ length: 255 }),
}

export const business = mysqlTable('businesses', {
	id: mysqlUUID().primaryKey().$default(() => randomUUID()),
	name: varchar({ length: 255 }).notNull(),
	phone: varchar({ length: 255 }).notNull(),
	...historicalFields
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

export type AdminSession = Pick<User, 'id' | 'email' | 'name' | 'isActive'> & {
	role: 'admin';
	businessId: null; // siempre null
};

export type BusinessmanSession = Pick<User, 'id' | 'email' | 'name' | 'isActive'> & {
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
	...historicalFields,
	businessId: mysqlUUID().references(() => business.id, { onDelete: 'cascade' })
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
	stock: decimal({ precision: 10, scale: 2, unsigned: true }).default('0').notNull(),
	minStock: decimal({ precision: 10, scale: 2, unsigned: true }).default('0').notNull(),
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
	quantity: decimal({ precision: 10, scale: 2, unsigned: true }).notNull(),

	...auditableFields,
	...tenantFields,
});


export type Recipe = InferSelectModel<typeof recipe>;
export type RecipeType = Recipe['outputType'];
export type NewRecipe = InferInsertModel<typeof recipe>;
export type RecipeComponent = InferSelectModel<typeof recipeComponent>;
export type NewRecipeComponent = InferInsertModel<typeof recipeComponent>;

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
export type TransactionType = Transaction['type'];
export type NewTransaction = InferInsertModel<typeof transaction>;

/**
 * Entrada de transaccion, actualmente esta pensado para productos
 */
export const record = mysqlTable('transaction_details', {
	id: bigint({ mode: 'number', unsigned: true }).autoincrement().primaryKey(),
	transactionId: bigint({ mode: 'number', unsigned: true })
		.notNull()
		.references(() => transaction.id, { onDelete: 'cascade' }),

	name: varchar({ length: 255 }).notNull(),
	entityType: mysqlEnum(['item', 'service']).notNull(),
	entityId: bigint({ mode: 'number', unsigned: true }).notNull(),

	measureUnitSymbol: varchar({ length: 10 }).notNull(),

	// Transacción en sí:
	quantity: decimal({ precision: 10, scale: 2, unsigned: true }).notNull(),
	unitPrice: decimal({ precision: 12, scale: 2, unsigned: true }).notNull(),
	cost: decimal({ scale: 2, precision: 10, unsigned: true, }),
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

/**
 * ASSETS = Activo; add:debit,subtract:credit
 * LIABILITIES = Pasivo; add:credit,subtract:debit
 * EQUITY = Patrimonio; add:credit,subtract:debit
 * INCOME = Ingreso; add:credit,subtract:debit
 * EXPENSE = Egreso; add:debit,subtract:credit
 * COST = Costo; add:credit,subtract:debit
 * 
 * 
 * cuando el businessId es null, es global, usuarios normales no pueden editarlo pero si usarlo y extender de el.
 */
/**
 * para los index uniques que usan businessId, cuando es null (global) se debe validar a mano para evitar duplicidad,
 * codigo compuesto: {typocuenta}{personalizado};ej: {activo}{activo corriente}=11;21;212;22. max:####
 */
export const accountSubtype = mysqlTable('account_subtype', {
	id: bigint({ mode: 'number', unsigned: true }).autoincrement().primaryKey(),
	code: smallint({ unsigned: true }).notNull(),
	// compoundCode: smallint({ unsigned: true }).generatedAlwaysAs((): SQL => sql<number>`cast(concat(ORD(${accountSubtype.accountType}),${accountSubtype.code}) as int)`, { mode: 'virtual' }),
	name: varchar({ length: 255 }).notNull(),
	description: varchar({ length: 255 }).notNull(),
	accountType: mysqlEnum(['assets', 'liabilities', 'equity', 'income', 'expense', 'cost']).notNull(),
	businessId: mysqlUUID().references(() => business.id, { onDelete: 'cascade' }),
	...auditableFields,
}, (table) => [
	unique().on(table.businessId, table.accountType, table.code),
])

export type AccountSubtype = InferSelectModel<typeof accountSubtype>;
export type AccountType = AccountSubtype['accountType'];
export type NewAccountSubtype = InferInsertModel<typeof accountSubtype>;
export type EditAccountSubtype = Partial<Pick<AccountSubtype, 'accountType' | 'code' | 'description' | 'id' | 'name' | 'updatedBy'>>;
/**
 * codigo: ##### = {accountSubtypeId}{personalizado} = 11001
 */
export const account = mysqlTable('account', {
	id: bigint({ mode: 'number', unsigned: true }).autoincrement().primaryKey(),
	code: smallint({ unsigned: true }).notNull(),
	name: varchar({ length: 255 }).notNull(),
	description: varchar({ length: 255 }).notNull(),
	accountSubtypeId: bigint({ mode: 'number', unsigned: true }).notNull().references(() => accountSubtype.id, { onDelete: 'cascade' }),
	businessId: mysqlUUID().references(() => business.id, { onDelete: 'cascade' }),
	...auditableFields,
}, (table) => [
	unique().on(table.businessId, table.accountSubtypeId, table.code)
]);

export type Account = InferSelectModel<typeof account>;
export type NewAccount = InferInsertModel<typeof account>;
export type EditAccount = Partial<Pick<Account, 'accountSubtypeId' | 'code' | 'description' | 'id' | 'name' | 'updatedBy'>>;

/**
 * Identificado de elemento por negocio DOC-{yaer}-{code}: DOC-2025-65535
 */
export const journalEntry = mysqlTable('journal_entry', {
	id: bigint({ mode: 'number', unsigned: true }).autoincrement().primaryKey(),
	code: smallint({ unsigned: true }).notNull(),
	name: varchar({ length: 255 }).notNull(),
	description: varchar({ length: 700 }).notNull(),
	date: datetime({ mode: 'date' }).notNull(),
	year: smallint({ unsigned: true }).generatedAlwaysAs((): SQL => sql`YEAR(${journalEntry.date})`, { mode: 'stored' }),
	...auditableFields,
	...tenantFields,
}, (table) => [
	unique().on(table.businessId, table.year, table.code)
]);

export type JournalEntry = InferSelectModel<typeof journalEntry>;
export type NewJournalEntry = InferInsertModel<typeof journalEntry>;
export type EditJournalEntry = Partial<Pick<JournalEntry, 'date' | 'code' | 'description' | 'id' | 'name' | 'updatedBy'>>;

/**
 * Entradas 
 */
export const ledgerRecord = mysqlTable('ledger_record', {
	id: bigint({ mode: 'number', unsigned: true }).autoincrement().primaryKey(),
	voucher: varchar({ length: 255 }).notNull(),
	reference: varchar({ length: 255 }).notNull(),
	accountId: bigint({ mode: 'number', unsigned: true }).notNull().references(() => account.id, { onDelete: 'cascade' }),
	journalEntryId: bigint({ mode: 'number', unsigned: true }).notNull().references(() => journalEntry.id, { onDelete: 'cascade' }),
	debit: decimal({ scale: 2, precision: 10, unsigned: true, }),
	credit: decimal({ scale: 2, precision: 10, unsigned: true, }),
	...auditableFields,
	...tenantFields,
});

export type LedgerRecord = InferSelectModel<typeof ledgerRecord>;
export type NewLedgerRecord = InferInsertModel<typeof ledgerRecord>;
export type EditLedgerRecord = Partial<Pick<LedgerRecord, 'debit' | 'credit' | 'reference' | 'voucher' | 'accountId' | 'updatedBy'>>;
