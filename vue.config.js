const AntdDayjsWebpackPlugin = require('antd-dayjs-webpack-plugin');
const { resolve } = require('path');
const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const { VUE_APP_API_HOST, VUE_APP_API_PREFIX } = process.env;
module.exports = {
  pluginOptions: {
    electronBuilder: {
      // outputDir: 'dist_electron', // 输出目录
      builderOptions: {
        // publish: [{
        //   provider: 'github',
        //   owner: 'BWrong',
        //   repo: 'misthinTools',
        //   releaseType: 'draft'
        // }
        //   // {
        //   // provider: 'generic', // 自己托管服务器
        //   // url: 'http://10.6.30.238:8888/software/course-tools/'
        //   // }
        // ],
        // snap: {
        //   publish: ['github']
        // },
        win: {
          icon: './build/icons/icon.ico', // 应用文件图标
          target: [{ target: 'nsis', arch: ['x64'] }],
          legalTrademarks: 'myProduction'
        },
        mac: {
          icon: './build/icons/icon.icns',
          category: 'public.app-category.developer-tools', // 应用类别
          target: [{ target: 'dmg' }],
          darkModeSupport: true, // 深色模式支持
          extendInfo: {
            // LSUIElement: 1 // 不占用dock栏
          }
        },
        nsis: {
          oneClick: false, // 一键安装
          perMachine: false, // 辅助安装模式
          allowElevation: true, // 允许请求提升。 如果为false，则用户必须使用提升的权限重新启动安装程序。
          allowToChangeInstallationDirectory: true, // 允许修改安装目录
          createDesktopShortcut: true, // 创建桌面图标
          createStartMenuShortcut: true // 创建开始菜单图标
        },
        dmg: {
          contents: [
            {
              x: 410,
              y: 150,
              type: 'link',
              path: '/Applications'
            },
            {
              x: 130,
              y: 150,
              type: 'file'
            }
          ]
        },
        linux: {
          icon: 'build/electron-icon/icon.png',
          target: 'AppImage'
        },
        productName: 'webTools', // 安装文件名
        appId: 'org.xzy.electron',
        copyright: 'Copyright © 2021 ${author}', //版权信息
        asar: true,
        extraResources: ['server/**/**'] // 指定打包 Server 到 Resource 文件夹中。
        // files: ['/**/*'],
        // extraFiles: ['./extensions/'],
      },
      mainProcessFile: 'src/main/index.js',
      mainProcessWatch: ['src/main/**/*'],
      // extraResources: [
      //   {
      //     from: '/server/**',
      //     to: './test.exe'
      //   }
      // ],
      nodeIntegration: true
      // mainProcessArgs: [],
      // rendererProcessFile: 'src/main.js',
      // chainWebpackMainProcess: (config) => {}, //主进程配置
      // chainWebpackRendererProcess: (config) => {}, // 渲染进程配置
      // disableMainProcessTypescript: false, // 主进程禁用ts
      // mainProcessTypeChecking: false, // 主进程禁用类型检查
      // removeElectronJunk: false
    }
  },
  productionSourceMap: false,
  // 代理配置
  devServer: {
    //open: true, //设置启动项目时，是否在网页打开
    //port: 8080,
    proxy: {
      [VUE_APP_API_PREFIX]: {
        target: VUE_APP_API_HOST, // 你接口的域名
        // secure: false,
        // ws: true,
        // changeOrigin: true,
        pathRewrite: {
          [`^${VUE_APP_API_PREFIX}`]: '' // 需要rewrite的,即真实的服务器地址中是否包含api_root
        }
      }
    }
  },

  // webpack配置
  configureWebpack: {
    resolve: {
      // .mjs needed for https://github.com/graphql/graphql-js/issues/1272
      extensions: ['*', '.mjs', '.js', '.vue', '.json'],
      alias: {
        '@': resolve(__dirname, './src')
      }
    },
    plugins: [
      new AntdDayjsWebpackPlugin()
      // 去掉moment多余语言文件
      // new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
    ],
    externals: ['pg', 'sqlite3', 'tedious', 'pg-hstore']
  },
  chainWebpack: (config) => {
    // config.devtool = 'source-map';

    // 优化js压缩
    config.optimization.minimizer('terser').tap((args) => {
      args[0].terserOptions.compress.drop_console = true;
      args[0].terserOptions.compress.drop_debugger = true;
      return args;
    });
    config.when(process.env.NODE_ENV !== 'development', (config) => {
      config.optimization.splitChunks({
        chunks: 'all',
        cacheGroups: {
          vendor: {
            name: 'chunk-vendor',
            test: /[\\/]node_modules[\\/]/,
            priority: 10, // 优先级
            chunks: 'initial'
          },
          antd: {
            name: 'chunk-antd',
            test: /[\\/]node_modules[\\/]_?(ant-design-vue|@ant-design)(.*)/,
            priority: 20
          }
        }
      });
      config.optimization.runtimeChunk('single');
      // config.optimization.mergeDuplicateChunks=false;
    });
  },
  css: {
    extract: IS_PRODUCTION, //Default: 生产环境下是 true，开发环境下是 false,是否将组件中的 CSS 提取至一个独立的 CSS 文件中
    sourceMap: !IS_PRODUCTION, //是否为 CSS 开启 source map。设置为 true 之后可能会影响构建的性能
    loaderOptions: {
      less: {
        lessOptions: {
          javascriptEnabled: true,
          modifyVars: {
            '@primary-color': '#1890ff', // 全局主色
            '@link-color': '#1890ff', // 链接色
            '@success-color': '#52c41a', // 成功色
            '@warning-color': '#faad14', // 警告色
            '@error-color': '#FF4D4F', // 错误色
            '@font-size-base': '14px', // 主字号
            '@heading-color': 'rgba(0, 0, 0, 0.85)', // 标题色
            '@text-color': 'rgba(0, 0, 0, 0.65)', // 主文本色
            '@text-color-secondary': 'rgba(0, 0, 0, 0.45)', // 次文本色
            '@disabled-color': 'rgba(0, 0, 0, 0.25)', // 失效色
            '@border-radius-base': '4px', // 组件/浮层圆角
            '@border-color-base': '#d9d9d9', // 边框色
            '@box-shadow-base': '0 2px 8px rgba(0, 0, 0, 0.15)', // 浮层阴影
            '@btn-border-radius-base': '2px',
            '@btn-border-radius-sm': '2px',
            '@breadcrumb-link-color': '#333',
            '@breadcrumb-last-item-color': '@primary-color',
            '@layout-header-background': '@primary-color',
            '@primary-secondary-color': '#F5951E' // 全局主色
          }
        }
      }
    }
  }
};
