import { defineConfig, splitVendorChunkPlugin, loadEnv, UserConfig, ConfigEnv } from 'vite'
import swc from 'rollup-plugin-swc';

// TSConfig Paths is mostly for package Atomic Singularity, since it uses module paths
// which confuse Vite & SWC during the build
import tsconfigPaths from 'vite-tsconfig-paths'

import dts from 'vite-plugin-dts';

export default defineConfig((config: ConfigEnv): UserConfig => {
  let plugins = [
    tsconfigPaths(),
    splitVendorChunkPlugin(),
    dts({
      rollupTypes: true
    }),
    swc({
      configFile: "./.swcrc",
      rollup: {
        include: "**/*.ts",
        exclude: ""
      },
    })
  ]

  return {
    plugins: plugins,
    build: {
      rollupOptions: {
        preserveEntrySignatures: 'strict',
        input: {
          // Currently this only houses one type. No benefit to packaging
          //"index": "./src/index.ts",
          "authentication": "./src/systems/authentication/index.ts",
          "index": "./src/systems/core/index.ts",
          "dependency-injection": "./src/systems/dependency-injection/index.ts",
          "logging": "./src/systems/logging/index.ts",
        },
        output: {
          entryFileNames: '[name].js'
        },
        external: [
          // If we don't want MomentJS to be bundled
          //"moment"
        ]
      }
    },

    clearScreen: true,
    esbuild: false,
  }
})