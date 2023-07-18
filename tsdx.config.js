//tsdx.config.js
const postcss = require('rollup-plugin-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const typescript = require('@rollup/plugin-typescript');

module.exports = {
  rollup(config, options) {
    config.plugins.push(
      postcss({
        plugins: [
          autoprefixer(),
          cssnano({
            preset: 'default',
          }),
        ],
        // only write out CSS for the first bundle (avoids redundant extra files)
        // user need to include the css file in the build folder
        // extract: !!options.writeMeta,
        // inject: false,
        
        // No need to include css file in the build folder,
        // since we are using css-in-js
        // Append to <head /> as code running
        inject: true,
        // Keep it as false since we don't extract to css file anymore
        extract: false,
      })
    );
    config.plugins.push(typescript(
      {
        tsconfig: "tsconfig.json",
        outDir: "dist",
      }
    ));
    return config;
  },
};
