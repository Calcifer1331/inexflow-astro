import type { UserSession } from "@db/schema";

/**
 * Define los tipos de las propiedades de .env
 */
interface ImportMetaEnv {
    readonly DATABASE_URL: string;
    readonly REDIS_URL: string;
    // more env variables...
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}

/**
 * Define los tipos de la sesison
 */
declare namespace App {
    interface SessionData {
        user: UserSession;
    }
}