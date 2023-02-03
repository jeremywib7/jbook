import * as esbuild from "esbuild-wasm";
import {unpkgPathPlugin} from "../plugins/unpkg-path-plugin";
import {fetchPlugin} from "../plugins/fetch-plugin";

export const bundle = async (rawCode: string) => {
    await esbuild.initialize({
        worker: true,
        wasmURL: 'https://unpkg.com/esbuild-wasm@0.17.4/esbuild.wasm'
    });

    const result = await esbuild.build({
        entryPoints: ['index.js'],
        bundle: true,
        write: false,
        plugins: [
            unpkgPathPlugin(),
            fetchPlugin(rawCode)
        ],
        define: {
            global: 'window'
        }
    })

    return result.outputFiles[0].text;

}

export default bundle;
