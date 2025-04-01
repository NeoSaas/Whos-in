import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
  define: {
    APIKEY: process.env.VITE_APIKEY,
    AUTHDOMAIN: process.env.VITE_AUTHDOMAIN,
    PROJECTID: process.env.VITE_PROJECTID,
    STORAGEBUCKET: process.env.VITE_STORAGEBUCKET,
    MESSAGINGSENDERID: process.env.VITE_MESSAGINGSENDERID,
    APPID: process.env.VITE_APPID,
  },
});

