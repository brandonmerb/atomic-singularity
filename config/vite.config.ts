import { defineConfig, splitVendorChunkPlugin, UserConfig, ConfigEnv } from 'vite'

// TSConfig Paths is mostly for package Atomic Singularity, since it uses module paths
// which confuse Vite & SWC during the build
import tsconfigPaths from 'vite-tsconfig-paths'

// This is to generate types, since SWC does not do this
import dts from 'vite-plugin-dts';

// SWC for vite to actually handle the rendering
import swc from 'unplugin-swc'


export default defineConfig((config: ConfigEnv): UserConfig => {
  let plugins = [
    tsconfigPaths(),
    splitVendorChunkPlugin(),
    dts({
      rollupTypes: true,
    }),
    swc.vite({
      configFile: './config/.swcrc'
    })
  ]

  return {
    plugins: plugins,
    build: {
      rollupOptions: {
        preserveEntrySignatures: 'strict',
        input: {
          "index": "./src/index.ts"
        },
        output: {
          entryFileNames: '[name].js',
          // sourcemapFileNames: "[name].js.map",
          // sourcemap: true
        },
        external: [
        ]
      }
    },

    clearScreen: true,
    esbuild: false,
  }
})