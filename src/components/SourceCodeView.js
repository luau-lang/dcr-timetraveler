import { useEffect, useState } from "react";
import { monaco } from "react-monaco-editor";
import MonacoEditor from "react-monaco-editor/lib/editor";
import { language } from "../LuauMonarch";

monaco.languages.register({
    id: "luau",
    aliases: ["Luau", "luau"],
});

monaco.languages.setMonarchTokensProvider("luau", language);

export function SourceCodeView({ markers, source }) {
    const [editor, setEditor] = useState(null);

    useEffect(() => {
        if (editor === null) {
            return;
        }

        const model = editor.getModel();
        monaco.editor.setModelMarkers(model, "dcrtimetraveler", markers);
    }, [editor, markers]);

    return (
        <MonacoEditor
            height="400"
            language="luau"
            value={source}
            options={{
                readOnly: true,
                scrollBeyondLastLine: false,
                scrollBeyondLastColumn: false,
                minimap: {
                    enabled: false,
                }
            }}
            editorDidMount={setEditor}
        />
    )
}
