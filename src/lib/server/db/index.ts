import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
// import { env } from '$env/dynamic/private';

/**
 * Valida que la url de la base de datos este definida en el .env
 */
if (!import.meta.env.DATABASE_URL) throw new Error('DATABASE_URL is not set');

/**
 * Crea el pool de conexiones a la base de datos
 */
const client = mysql.createPool({
    uri: import.meta.env.DATABASE_URL,
    namedPlaceholders: true,
    connectionLimit: 10,
});

/**
 *Crea el objeto ORM
 */
export const db = drizzle(client, { logger: true, casing: 'snake_case', mode: 'default' });
