import nextConfig from 'eslint-config-next'

export default [
  ...nextConfig,
  {
    ignores: ['dist', 'node_modules'],
  },
]
