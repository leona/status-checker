export default {
  resolve: {
    modules: ["/app/public/js", "node_modules"],
    alias: {
      vue: 'vue/dist/vue.cjs.prod.js'
    }
   },
  entry: '/app/assets/js/app.js',
  output: {
    filename: 'app.js',
    path: "/app/dist/js",
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
    ],
  },
};