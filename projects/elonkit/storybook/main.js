const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  stories: ['../src/**/*.stories.mdx'],
  addons: [
    '@storybook/addon-knobs',
    '@storybook/addon-actions',
    '@storybook/addon-a11y',
    '@storybook/addon-viewport',
    {
      name: '@storybook/addon-docs',
      options: {
        configureJSX: true,
        babelOptions: {},
        sourceLoaderOptions: null
      }
    }
  ],
  webpackFinal: async config => {
    config.resolve.alias['~storybook'] = path.resolve(__dirname);
    config.resolve.alias['~utils'] = path.resolve(__dirname, '../src/utils');

    // https://github.com/storybookjs/storybook/issues/714
    config.plugins.push(
      new CopyWebpackPlugin({
        patterns: [
          {
            from: path.resolve(__dirname, '../src/assets'),
            to: './assets'
          }
        ]
      })
    );

    return config;
  }
};
