module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        useBuiltIns: 'usage',
        corejs: 3
      }
    ],
    [
      '@vue/app',
      {
        useBuiltIns: 'entry',
        polyfills: [
          'es6.promise',
          'es6.symbol',
          'es7.array.includes',
          'es6.string.includes'
        ]
      }
    ]
  ],
  plugins: [
    '@babel/plugin-transform-runtime',
    [
      'import',
      {
        libraryName: 'vant',
        libraryDirectory: 'es',
        style: true
      },
      'vant'
    ]
  ]
}
