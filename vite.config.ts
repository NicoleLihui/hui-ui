import { defineConfig } from 'vite'
import { resolve } from 'path'
import vue from '@vitejs/plugin-vue'
// element plus按需引入插件
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
// icons
import Icons from 'unplugin-icons/vite'
import { FileSystemIconLoader } from 'unplugin-icons/loaders'
import IconsResolver from 'unplugin-icons/resolver'
// @ts-ignore
import DefineOptions from 'unplugin-vue-define-options/vite'

// 生成dts文件
import viteDts from 'vite-plugin-dts'
// 复制静态文件
import { viteStaticCopy } from 'vite-plugin-static-copy'
// 删除/清理构建文件夹
import cleanPlugin from 'vite-plugin-clean'

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    'process.env': {},
  },
  plugins: [
    viteDts({
      insertTypesEntry: true, // 生成类型声明入口
      staticImport: true,
      tsConfigFilePath: './tsconfig.json',
    }),
    viteStaticCopy({
      targets: [
        {
          src: './global.d.ts',
          dest: '',
        },
      ],
    }),
    cleanPlugin({
      targetFiles: ['dist'],
    }),
    vue(),
    DefineOptions(),
    AutoImport({
      dts: pathResolve('src/auto-imports.d.ts'),
      imports: ['vue'],
      resolvers: [
        ElementPlusResolver({
          importStyle: 'sass',
        }),
        IconsResolver({
          prefix: 'Icon', //  从 iconify 中自动导入，默认前缀，默认i
        }),
      ],
    }),
    Components({
      dts: false,
      resolvers: [
        IconsResolver({
          prefix: 'svg', // 自定义图标 prefix
          customCollections: ['icon'], // 自定义图标 collection 定义
          enabledCollections: ['ep'], // 从 iconify 中自动导入任何图标集,eg: ep
        }),
        ElementPlusResolver({
          importStyle: 'sass',
        }),
      ],
    }),
    // { prefix } - { collection } - { iconName } 如：<svg-icon-search /> / <SvgIconSearch />
    // prefix - 前缀，默认为i，如prefix配置成了icon，即组件名以icon开头；collection - 图标集名；iconName - 图标名，也可用大驼峰
    Icons({
      autoInstall: true,
      scale: 1, // 缩放
      compiler: 'vue3', // 编译方式
      defaultClass: '', // 默认类名
      defaultStyle: '', // 默认样式
      customCollections: {
        // 自定义图标 collection 引入
        icon: FileSystemIconLoader('./src/icons', svg => svg.replace(/^<svg /, '<svg fill="currentColor" ')),
      },
    }),
  ],
  build: {
    outDir: 'dist', // 输出文件名称
    lib: {
      entry: pathResolve('./packages/index.ts'), // 指定组件的编译入口文件
      name: 'HuiUi',
      fileName: 'hui-ui',
    }, // 库的编译模式配置
    rollupOptions: {
      // 确保外部化那些我们不想打包进库的依赖
      external: ['vue'],
      output: {
        // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
        globals: {
          vue: 'Vue',
        },
      },
    }, // rollup打包配置
  },
  resolve: {
    alias: {
      '@': pathResolve('src'),
      '@packages': pathResolve('packages'),
      '@images': pathResolve('src/assets/images'),
      '@styles': pathResolve('src/assets/styles'),
    },
  },
  css: {
    /* CSS 预处理器 */
    preprocessorOptions: {
      scss: {
        additionalData:
          ' @use "@styles/variables.scss" as *; @use "@styles/mixin.scss" as *; @use "@styles/element/index.scss" as *;',
        javascriptEnabled: true,
      },
    },
  },
})

function pathResolve(dir: string) {
  return resolve(__dirname, '.', dir)
}
