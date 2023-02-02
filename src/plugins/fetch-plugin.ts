import * as esbuild from "esbuild-wasm";
import axios from "axios";
import localforage from "localforage";

const fileCache = localforage.createInstance({
    name: 'filecache'
});

export const fetchPlugin = (inputCode: string) => {
    return {
        name: 'unpkg-path-plugin',
        setup(build: esbuild.PluginBuild) {
            build.onLoad({filter: /(^index\.js$)/}, () => {
                return {
                    loader: 'jsx',
                    contents: inputCode,
                };
            });

            build.onLoad({filter: /.*/,}, async (args: any) => {
                // check to see if we already fetched this file
                // and if it's already in cache
                const cachedResult = await fileCache.getItem<esbuild.OnLoadResult>(args.path);

                // if already in the cache
                if (cachedResult) {
                    return cachedResult;
                }
            })

            build.onLoad({filter: /.css$/}, async (args: any) => {

                try {
                    const {data, request} = await axios.get(args.path);

                    const escaped = data
                        .replace(/\n/g, '') // replace new line with empty string
                        .replace(/"/g, '\\"') // remove all double quotes
                        .replace(/'/g, "\\'"); // remove all single quote
                    const contents = `
                            const style = document.createElement('style');
                            style.innerText = '${escaped}';
                            document.head.appendChild(style);
                        `;
                    const result: esbuild.OnLoadResult = {
                        loader: 'jsx',
                        contents,
                        resolveDir: new URL('./', request.responseURL).pathname
                    };
                    //store response in cache
                    await fileCache.setItem(args.path, result);
                    return result;
                } catch (e) {
                    console.log(e);
                }

            });

            build.onLoad({filter: /.*/}, async (args: any) => {

                try {
                    const {data, request} = await axios.get(args.path);
                    const result: esbuild.OnLoadResult = {
                        loader: 'jsx',
                        contents: data,
                        resolveDir: new URL('./', request.responseURL).pathname
                    };
                    //store response in cache
                    await fileCache.setItem(args.path, result);
                    return result;
                } catch (e) {
                    console.log(e);
                }
            });
        }
    }
}

