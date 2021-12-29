import { transformAsync } from '@babel/core';
import { createFilter } from '@rollup/pluginutils';
import { resolve as resolvePath } from 'path';
import resolve from 'resolve';
import { defineConfig } from 'vite';

const dirname = new URL('.', import.meta.url).pathname;

// Allows to ignore query parameters, as in Vue SFC virtual modules.
function parseId(url) {
  return { id: url.split('?', 2)[0] };
}

// From https://github.com/preactjs/preset-vite/blob/main/src/index.ts but without @prefresh/vite
function preact({ include, exclude } = {}) {
  let config;

  const shouldTransform = createFilter(
    include || [/\.[tj]sx?$/],
    exclude || [/node_modules/]
  );

  const jsxPlugin = {
    name: 'vite:preact-jsx',
    enforce: 'pre',
    config() {
      return {
        optimizeDeps: {
          include: ['preact/jsx-runtime'],
        },
      };
    },
    configResolved(resolvedConfig) {
      config = resolvedConfig;
    },
    resolveId(id) {
      return id === 'preact/jsx-runtime' ? id : null;
    },
    load(id) {
      if (id === 'preact/jsx-runtime') {
        const runtimePath = resolve.sync('preact/jsx-runtime', {
          basedir: config.root,
        });
        const exports = ['jsx', 'jsxs', 'Fragment'];
        return [
          `import * as jsxRuntime from ${JSON.stringify(runtimePath)}`,
          // We can't use `export * from` or else any callsite that uses
          // this module will be compiled to `jsxRuntime.exports.jsx`
          // instead of the more concise `jsx` alias.
          ...exports.map((name) => `export const ${name} = jsxRuntime.${name}`),
        ].join('\n');
      }
    },
    async transform(code, url) {
      // Ignore query parameters, as in Vue SFC virtual modules.
      const { id } = parseId(url);

      if (!shouldTransform(id)) return;

      const parserPlugins = [
        'importMeta',
        // This plugin is applied before esbuild transforms the code,
        // so we need to enable some stage 3 syntax that is supported in
        // TypeScript and some environments already.
        'topLevelAwait',
        'classProperties',
        'classPrivateProperties',
        'classPrivateMethods',
        !id.endsWith('.ts') && 'jsx',
        /\.tsx?$/.test(id) && 'typescript',
      ].filter(Boolean);

      const result = await transformAsync(code, {
        babelrc: false,
        configFile: false,
        ast: true,
        root: config.root,
        filename: id,
        parserOpts: {
          sourceType: 'module',
          allowAwaitOutsideFunction: true,
          plugins: parserPlugins,
        },
        generatorOpts: {
          decoratorsBeforeExport: true,
        },
        plugins: [
          [
            '@babel/plugin-transform-react-jsx',
            {
              runtime: 'automatic',
              importSource: 'preact',
            },
          ],
          ...(config.isProduction ? [] : ['babel-plugin-transform-hook-names']),
        ],
        sourceMaps: true,
        inputSourceMap: false,
      });

      // NOTE: Since no config file is being loaded, this path wouldn't occur.
      if (!result) return;

      return {
        code: result.code || code,
        map: result.map,
      };
    },
  };
  return [
    {
      name: 'preact:config',
      config() {
        return {
          resolve: {
            alias: {
              'react-dom/test-utils': 'preact/test-utils',
              'react-dom': 'preact/compat',
              react: 'preact/compat',
            },
          },
        };
      },
    },
    jsxPlugin,
  ];
}

export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production';

  return {
    plugins: [preact()],
    build: {
      minify: isProduction,
      rollupOptions: {
        input: {
          index: resolvePath(dirname, 'index.html'),
        },
      },
    },
    test: {
      environment: 'jsdom',
    },
  };
});
