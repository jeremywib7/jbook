import MonacoEditor, {OnMount} from "@monaco-editor/react";
import React, {useRef} from "react";
import prettier from "prettier";
import parser from 'prettier/parser-babel';
import {Button} from 'primereact/button';
import './code-editor.css';

interface CodeEditorProps {
    initialValue: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({initialValue}) => {

    const editorRef = useRef<any>(null);
    const handleEditorDidMount: OnMount = (editor) => {
        editorRef.current = editor;
        editor.focus();
        editor.getModel()?.updateOptions({
            tabSize: 2
        });
    };

    const onFormatClick = () => {
        // get current value from editor
        const unformatted = editorRef.current.getModel().getValue();

        // format the value
        const formatted = prettier.format(
            unformatted,
            {
                parser: 'babel',
                plugins: [
                    parser
                ],
                useTabs: false,
                semi: true,
                singleQuote: false
            }).replace(/\n$/, '');

        editorRef.current.setValue(formatted);
    }

    return (
        <div className="editor-wrapper relative h-full">
            <div className="button-format absolute right-0 z-1">
                <Button
                    onClick={onFormatClick}
                    label="Format"
                    aria-label="Submit"
                />
            </div>
            <MonacoEditor
                className="relative h-full"
                onMount={handleEditorDidMount}
                value={initialValue}
                theme="vs-dark"
                language="javascript"
                height={'500px'}
                options={{
                    wordWrap: 'on',
                    minimap: {
                        enabled: false
                    },
                    showUnused: false,
                    folding: false,
                    lineNumbersMinChars: 3,
                    fontSize: 16,
                    scrollBeyondLastLine: false,
                    automaticLayout: true
                }}
            />
        </div>
    )
}

export default CodeEditor;
