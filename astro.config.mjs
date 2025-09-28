// @ts-check
import { defineConfig } from 'astro/config';

/**
 * Servidor de el proyecto
 */
import node from '@astrojs/node';

import tailwindcss from '@tailwindcss/vite';

import svelte from '@astrojs/svelte';

// https://astro.build/config
export default defineConfig({
  output: "server",

  server: {
      host: true, //para que el servidor acepte peticiones de cualquier origen
  },

  adapter: node({
      mode: 'standalone'
  }),

  session: {
      // driver: "redis",
      // options: {
      //   url: import.meta.env.REDIS_URL,
      //   ttl: 3600, // 1 hora en segundos
      //   // Añadir configuración de limpieza:
      //   scanCount: 50, // Claves a escanear por iteración
      // },
      // cookie: {
      //   maxAge: 3600
      // }
  },

  vite: {
      plugins: [tailwindcss()]
  },

  integrations: [svelte()]
});