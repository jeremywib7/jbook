import React, {useEffect, useRef} from "react";
import './preview.css';

interface PreviewProps {
    code: string;
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


const Preview: React.FC<PreviewProps> = ({code}) => {
    const iframe = useRef<any>();

    useEffect(() => {
        iframe.current.srcDoc = html;
        iframe.current.contentWindow.postMessage(code, '*');
    }, [code]);

    return (
        <div className="preview-wrapper relative h-full">
            <iframe
                className="bg-white h-full"
                title={'code preview'}
                ref={iframe}
                sandbox={'allow-scripts'}
                srcDoc={html}
            />
        </div>
    )
}

export default Preview;
