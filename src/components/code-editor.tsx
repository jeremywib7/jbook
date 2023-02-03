import './code-editor.css';
import './syntax.css';
import Editor, {OnMount} from "@monaco-editor/react";
import React, {useRef} from "react";
import prettier from "prettier";
import parser from 'prettier/parser-babel';
import {Button} from 'primereact/button';
import {parse} from '@babel/parser'
import traverse from '@babel/traverse'
import MonacoJSXHighlighter from 'monaco-jsx-highlighter';

interface CodeEditorProps {
    initialValue: string;

    onChange(value: string): void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({initialValue, onChange}) => {

    const editorRef = useRef<any>(null);
    const onEditorDidMount: OnMount = (editor) => {
        editorRef.current = editor;
        editor.onDidChangeModelContent(() => {
            // console.log(editor.getValue());
            onChange(editor.getValue());
        });

        editor.getModel()?.updateOptions({tabSize: 2});
        // const highlighter = new MonacoJSXHighlighter(
        //     // @ts-ignore
        //     window.monaco, parse, traverse, editor)
        //
        // highlighter.highLightOnDidChangeModelContent(
        //     () => {
        //     },
        //     () => {
        //     },
        //     undefined,
        //     () => {
        //     }
        // );
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
            <Editor
                className="relative h-full"
                onMount={onEditorDidMount}
                value={initialValue}
                theme="vs-dark"
                defaultLanguage="javascript"
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
