import { useCallback, useEffect, useState } from "react";
import { monaco } from "react-monaco-editor";
import MonacoEditor from "react-monaco-editor";
import { language } from "../LuauMonarch";

monaco.languages.register({
    id: "luau",
    aliases: ["Luau", "luau"],
});

monaco.languages.setMonarchTokensProvider("luau", language);

export function SourceCodeView({ markers, source }) {
    const [editor, setEditor] = useState(null);

    const updateMarkers = useCallback(() => {
        if (editor === null) {
            return;
        }

        const model = editor.getModel();
        monaco.editor.setModelMarkers(model, "luau", markers);
    }, [editor, markers]);

    useEffect(updateMarkers, [editor, markers]);

    return (
        <MonacoEditor
            height="400"
            language="luau"
            value={source}
            options={{
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
