import "primereact/resources/themes/lara-dark-indigo/theme.css";  //theme
import "primereact/resources/primereact.min.css";                  //core css
import "primeicons/primeicons.css";                                //icons
import "primeflex/primeflex.css";
import * as esbuild from 'esbuild-wasm';
import ReactDOM from 'react-dom/client';
import React, {useEffect, useRef, useState} from 'react'
import bundle from "./bundler";
import CodeCell from "./components/code-cell";


const App = () => {
    const ref = useRef<any>();

    const startService = async () => {
        await esbuild.initialize({
            worker: true,
            wasmURL: 'https://unpkg.com/esbuild-wasm@0.17.4/esbuild.wasm'
        });
        ref.current = true;
    }

    useEffect(() => {
        (async () => {
            if (!ref.current) {
                return;
            }
            await startService();
        })();
    }, []);

    return (
        <div>
            <CodeCell></CodeCell>
        </div>
    );
};

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <App/>
)

// import React from 'react';
// import ReactDOM from 'react-dom';
//
// ReactDOM.render(<h1>test</h1>, document.querySelector('#root'));

