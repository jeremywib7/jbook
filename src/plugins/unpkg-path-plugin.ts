import * as esbuild from 'esbuild-wasm';
export const unpkgPathPlugin = () => {
    return {
        name: 'unpkg-path-plugin',
        setup(build: esbuild.PluginBuild) {

            // handle root entry file of index.js
            build.onResolve({filter: /(^index\.js$)/}, () => {
                return {
                    path: 'index.js',
                    namespace: 'normal-text'
                }
            });

            // handle relative path in module
            build.onResolve({filter: /^\.+\//}, (args: any) => {
                return {
                    path: new URL(
                        args.path,
                        'https://unpkg.com' + args.resolveDir + '/').href,
                    namespace: 'nested-pkg'
                }
            });

            // handle main file in module
            build.onResolve({filter: /.*/}, async (args: any) => {
                return {
                    path: `https://unpkg.com/${args.path}`,
                    namespace: 'normal-pkg'
                }
            });

        },
    };
};
