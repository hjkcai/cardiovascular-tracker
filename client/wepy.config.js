var prod = process.env.NODE_ENV === 'production'

module.exports = {
  wpyExt: '.wpy',
  eslint: true,
  compilers: {
    sass: {
      compress: true
    },
    babel: {
      sourceMap: true,
      presets: [
        'es2015',
        'stage-1'
      ],
      plugins: [
        'transform-decorators-legacy',
        'transform-export-extensions',
        'syntax-export-extensions'
      ]
    }
  },
  plugins: {
    axios: {},
    replace: {
      filter: /\.js$/,
      config: {
        find: 'API_HOST',
        replace: 'localhost:3000'
      }
    }
  }
}

if (prod) {
  delete module.exports.compilers.babel.sourcesMap

  // 压缩js
  Object.assign(module.exports.plugins, {
    uglifyjs: {
      filter: /\.js$/,
      config: {
      }
    },
    imagemin: {
      filter: /\.(jpg|png|jpeg)$/,
      config: {
        jpg: {
          quality: 80
        },
        png: {
          quality: 80
        }
      }
    }
  })
}
