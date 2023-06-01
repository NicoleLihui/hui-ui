import type { StorybookConfig } from '@storybook/vue3-vite'
import { mergeConfig } from 'vite'
import { resolve } from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import vue from '@vitejs/plugin-vue'
const config: StorybookConfig = {
  stories: ['../src/stories/**/*.stories.@(js|jsx|ts|tsx)', '../packages/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-a11y',
  ],
  framework: {
    name: '@storybook/vue3-vite',
    options: {},
  },
  staticDirs: ['../public'],
  docs: {
    autodocs: 'tag',
  },
  previewHead: head => `
    ${head}
    <link rel="preload" href="/favicon.ico">
    <title> HUI-UI </title>
  `,
  async viteFinal(config, options) {
    // Add your configuration here
    return mergeConfig(config, {
      define: {
        'process.env': {},
      },
      resolve: {
        extensions: ['.js', '.vue', '.json', '.jsx', '.scss', '.css'],
        alias: {
          '@': pathResolve('src'),
          '@images': pathResolve('src/assets/images'),
          '@styles': pathResolve('src/assets/styles'),
          _: pathResolve('node_modules'),
        },
      },
      css: {
        preprocessorOptions: {
          scss: {
            additionalData:
              ' @use "@styles/variables.scss" as *; @use "@styles/mixin.scss" as *; @use "@styles/element/index.scss" as *;',
            javascriptEnabled: true,
          },
        },
      },
      PluginArray: [
        vue({
          reactivityTransform: true,
        }),
        AutoImport({
          dts: '../auto-imports.d.ts',
          imports: ['vue'],
          resolvers: [
            ElementPlusResolver({
              importStyle: 'sass',
            }),
            IconsResolver({
              prefix: 'Icon', // 从 iconify 中自动导入，前缀，默认i
            }),
          ],
        }),
        Components({
          dts: false,
          resolvers: [
            ElementPlusResolver({
              importStyle: 'sass',
            }),
            IconsResolver({
              enabledCollections: ['ep'], // 从 iconify 中自动导入任何图标集,eg: ep
            }),
          ],
        }),
        Icons({
          autoInstall: true,
        }),
      ],
    })
  },
}
export default config
function pathResolve(dir) {
  return resolve(__dirname, '../', dir)
}
