import * as esbuild from 'esbuild-wasm';
import ReactDOM from 'react-dom/client';
import React, {useEffect, useRef, useState} from 'react'
import {unpkgPathPlugin} from "./plugins/unpkg-path-plugin";
import {fetchPlugin} from "./plugins/fetch-plugin";
import CodeEditor from "./components/code-editor";
import "primereact/resources/themes/lara-dark-indigo/theme.css";  //theme
import "primereact/resources/primereact.min.css";                  //core css
import "primeicons/primeicons.css";                                //icons
import "primeflex/primeflex.css"

const App = () => {

    const [input, setInput] = useState('');
    // const ref = useRef<any>();
    const iframe = useRef<any>();

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

    const onClick = async (input: string) => {
        // if (!ref.current) {
        //     return;
        // }
        iframe.current.srcDoc = html;

        const result = await esbuild.build({
            entryPoints: ['index.js'],
            bundle: true,
            write: false,
            plugins: [
                unpkgPathPlugin(),
                fetchPlugin(input)
            ],
            define: {
                global: 'window'
            }
        })
        // setCode(result.outputFiles[0].text);
        iframe.current.contentWindow.postMessage(result.outputFiles[0].text, '*');
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
            ></CodeEditor>
            <textarea
                value={input}
                onChange={(e) => {
                    // onClick(e.target.value).then(() => null);
                    setInput(e.target.value);
                }}>
            </textarea>
            <div>
                {/*<button onClick={onClick}>Submit</button>*/}
            </div>
            <iframe
                title={'code preview'}
                ref={iframe}
                sandbox={'allow-scripts'}
                srcDoc={html}>
            </iframe>
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

