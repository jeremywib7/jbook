import "primereact/resources/themes/lara-dark-indigo/theme.css";  //theme
import "primereact/resources/primereact.min.css";                  //core css
import "primeicons/primeicons.css";                                //icons
import "primeflex/primeflex.css";
import * as esbuild from 'esbuild-wasm';
import ReactDOM from 'react-dom/client';
import React, {useEffect, useRef, useState} from 'react'
import {unpkgPathPlugin} from "./plugins/unpkg-path-plugin";
import {fetchPlugin} from "./plugins/fetch-plugin";
import CodeEditor from "./components/code-editor";
import Preview from './components/preview';
import {Button} from "primereact/button";

const App = () => {

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

    const onChange = () => {
    }

    const onClick = async () => {
        const output = await bundle();
        setCode(result.outputFiles[0].text);
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
        <div>
            <CodeEditor
                initialValue={''}
                onChange={(value) => setInput(value)}/>
            <div>
                {/*<Button onClick={onClick}>Submit</Button>*/}
            </div>
            <Preview code={code}/>code
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

