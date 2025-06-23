import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { ghPages } from "vite-plugin-gh-pages";

// ★ リポジトリ名が公開 URL に入る場合は必ず base を設定
export default defineConfig({
  base: "/HakoiriMusume/",     // 例: https://<USER>.github.io/**hakoiri-musume**/
  plugins: [react(), ghPages()],
});