import type { UserSession } from "@db/schema";

declare global {
    namespace App {
        /**
         * Define los tipos de la sesison
         */
        interface SessionData {
            user: UserSession;
        }
        interface Locals {
            /**
             * Esta variable debe ser validada en el middleware, y solo puede ser usada en los paths de /admins y /tenants
             */
            authenticatedUser: UserSession
        }
    }

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
}