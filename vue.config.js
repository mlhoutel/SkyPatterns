module.exports = {
  transpileDependencies: ['vuetify'],
  devServer: {
    disableHostCheck: true,
    port: 8080,
  },
  publicPath: '/',
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        extraResources: [
          {
            from: './src/api',
            to: 'api',
            filter: ['**/*'],
          },
        ],
      },
    },
  },
}
