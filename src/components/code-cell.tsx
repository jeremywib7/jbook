import "primereact/resources/themes/lara-dark-indigo/theme.css";  //theme
import "primereact/resources/primereact.min.css";                  //core css
import "primeicons/primeicons.css";                                //icons
import "primeflex/primeflex.css";
import "./resizable.css"
import * as esbuild from 'esbuild-wasm';
import React, {useEffect, useState} from 'react'
import {Button} from "primereact/button";
import bundle from "../bundler";
import CodeEditor from "./code-editor";
import Preview from "./preview";
import Resizable from "./resizable";
import {Splitter, SplitterPanel} from "primereact/splitter";

const CodeCell = () => {

    const [input, setInput] = useState('');
    const [code, setCode] = useState('');
    // const ref = useRef<any>();

    const startService = async () => {
        await esbuild.initialize({
            worker: true,
            wasmURL: 'https://unpkg.com/esbuild-wasm@0.17.4/esbuild.wasm'
        })
        // ref.current = true
    }

    useEffect(() => {
        (async () => {
            await startService();
        })();
    }, []);
    const onClick = async () => {
        const output = await bundle(input);
        setCode(output);
    }

    const html = `
          <html lang="">
            <head><title></title></head>
            <body>
               <div id="root"></div>
               <script>
                window.addEventListener('message', (event) => {
                    try {
                       eval(event.data);
                    } catch (e) {
                      const root = document.querySelector('#root');
                      root.innerHTML = '<div style="color: red;"><h4>Runtime Error</h4>' + e + '</div>';
                      console.error(e);
                    }
                }, false);
               </script>
            </body>
          </html>
        `;

    return (
        <Resizable direction="vertical">
            <div className="flex h-full flex-row">
                <Resizable direction="horizontal">
                    <CodeEditor
                        initialValue={''}
                        onChange={(value) => setInput(value)}/>
                </Resizable>
                <Preview code={code}/>
            </div>
        </Resizable>
    );
};

export default CodeCell;

