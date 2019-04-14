module.exports = {
  presets: [
    [
      '@babel/env',
      {
        'targets': {
          'ie': 11,
        },
        'useBuiltIns': 'entry',
        'modules': 'commonjs',
      }
    ],
    '@babel/typescript',
  ],
  plugins: [
    '@babel/proposal-class-properties',
    '@babel/proposal-object-rest-spread',
    '@babel/syntax-dynamic-import',
    '@babel/proposal-export-default-from'
  ],
}
