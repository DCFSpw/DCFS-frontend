import { defineConfig } from "vitest/config";
import vue from "@vitejs/plugin-vue";
import { quasar, transformAssetUrls } from "@quasar/vite-plugin";
import jsconfigPaths from "vite-jsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
  test: {
    globals: true,
    environment: "happy-dom",
    setupFiles: ["test/vitest/setup-file.js", "vitest-localstorage-mock"],
    include: [
      // Matches vitest tests in any subfolder of 'src' or into 'test/vitest/__tests__'
      // Matches all files with extension 'js', 'jsx', 'ts' and 'tsx'
      "src/**/*.vitest.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}",
      "test/vitest/__tests__/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}",
    ],
    coverage: {
      all: true,
      exclude: [
        "**/*.vue",
        "node_modules/**",
        "dist/**",
        "public/**",
        "*.config.js",
        ".quasar/**",
        "src/boot/**",
        "test/**",
        "src/validation/**",
        ".*.js",
        "src/modules/Volume/volumeConst.js",
        "src/modules/File/Extesion/**",
        "src/modules/Disk/Const/**",
        "src/modules/Provider/providerType.js",
        "src/App.vue",
        "src/modules/useNotification.js",
        "src/router/**",
      ],
    },
  },
  plugins: [
    vue({
      template: { transformAssetUrls },
    }),
    quasar({
      sassVariables: "src/quasar-variables.scss",
    }),
    jsconfigPaths(),
  ],
});
