import type { Configuration } from "webpack";
import webpack from "webpack";
const CracoLessPlugin = require("craco-less");

module.exports = {
  babel: {
    presets: [
      "@babel/preset-env",
      "@emotion/babel-preset-css-prop",
      [
        "@babel/preset-react",
        { runtime: "automatic", importSource: "@emotion/react" },
      ],
    ],
    // Ah, i got baited into doing this. I remember that this "fix" doesn't
    // work. But since it had bee 5 months since i tried the fix, i thought
    // maybe it would work again. Nope, got baited. RIP. I guess we just wait
    // for es2022 to land.
    // [
    //   "@babel/preset-plugin-proposal-private-property-in-object", { loose:
    //   true },
    // ],
    // exclude: /node_modules\/(?!@jup-ag)/,
    // applyToExternalFiles: true,
    // module: {
    //   rules: [
    //     // This would match almost any react-native module
    //     // {
    //     //   test: /(@?react-(navigation|native)).*\.(ts|js)x?$/,
    //     //   include: /node_modules/,
    //     //   exclude: [/react-native-web/, /\.(native|ios|android)\.(ts|js)x?$/],
    //     //   loader: 'babel-loader'
    //     // },
    //     // This would match ui-kitten
    //     {
    //       test: /.*$/,
    //       loader: "babel-loader",
    //     },
    //   ],
    // },
  },
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: { "@primary-color": "#1890ff" },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
  webpack: {
    configure: (config: Configuration) => {
      if (!config?.module?.rules) {
        throw new Error("config definitely has config.module.rules");
      }
      if (!config?.plugins) {
        throw new Error("config definitely has config.plugins");
      }

      config.ignoreWarnings = [/Failed to parse source map/];

      config.resolve = {
        ...config.resolve,
        fallback: {
          os: false,
          util: false,
          fs: false,
          process: false,
          path: false,
          buffer: require.resolve("buffer/"),
          crypto: require.resolve("crypto-browserify"),
          stream: require.resolve("stream-browserify"),
        },
      };

      config.plugins.unshift(
        new webpack.ProvidePlugin({
          Buffer: ["buffer", "Buffer"],
        })
      );

      config.module.rules.push({
        test: /\.m?js/,
        resolve: {
          fullySpecified: false,
        },
      });

      // solana wallet adapter, ledger need to be transpiled
      config.module.rules.push({
        test: /\.js/,
        loader: require.resolve("babel-loader"),
        exclude: (file) =>
          !file.includes("@solana/wallet-adapter") &&
          !file.includes("@ledgerhq/devices"),
      });

      // Start wormhole sdk config
      config.experiments = {
        asyncWebAssembly: true,
      };
      config.module.rules.push({
        test: /\.wasm$/,
        type: "webassembly/async",
      });
      // End wormhole sdk config

      // overwrite react-scripts default svg loader to allow inlining of svgs,
      // could break after react-scripts update
      const oneOfRuleIndex: any = config.module.rules.findIndex(
        (rule: any) => !!rule.oneOf
      );
      if (oneOfRuleIndex > -1) {
        const svgRuleIndex = (
          config.module.rules[oneOfRuleIndex] as any
        ).oneOf.findIndex(
          (oneOf: any) => oneOf.test.source === /\.svg$/.source
        );
        if (svgRuleIndex > -1) {
          (config.module.rules[oneOfRuleIndex] as any).oneOf[svgRuleIndex] = {
            test: /\.svg$/,
            type: "asset/inline",
          };
        }
      }

      return config;
      // {
      //   module: {
      //     rules: [
      //       {
      //         type: "javascript/auto",
      //         test: /\.mjs$/,
      //         use: [],
      //       },
      //     ],
      //   },
      // }
    },
  },
};
