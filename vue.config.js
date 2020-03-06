module.exports = {
  transpileDependencies:[/node_modules[/\\\\]vuetify[/\\\\]/],
  devServer: {
      disableHostCheck: true,
      port: 8080,
      public: '0.0.0.0:8080',
      headers: {
        "Access-Control-Allow-Origin": "*"
      }
  },
  publicPath: "/"
}