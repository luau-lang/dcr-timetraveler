import { useCallback, useEffect, useState } from "react";
import { monaco } from "react-monaco-editor";
import MonacoEditor from "react-monaco-editor";
import { language } from "../LuauMonarch";
import { EventEmitter } from "events";

monaco.languages.register({
    id: "luau",
    aliases: ["Luau", "luau"],
});

class TypeInlayHintsProvider {
    constructor() {
        this.emitter = new EventEmitter();
        this.hints = [];
    }

    provideInlayHints(model, range, token) {
        return {
            dispose: () => {},
            hints: this.hints,
        };
    }

    setInlayHints(hints) {
        this.hints = hints;
        this.emitter.emit("inlaysChanged");
    }

    onDidChangeInlayHints(cb) {
        return this.emitter.on("inlaysChanged", cb);
    }
}

const hintsProvider = new TypeInlayHintsProvider();

monaco.languages.setMonarchTokensProvider("luau", language);
monaco.languages.registerInlayHintsProvider("luau", hintsProvider);

export function SourceCodeView({ markers, source, typeLocations, typeStrings, previousTypeStrings }) {
    const [editor, setEditor] = useState(null);

    const updateMarkers = useCallback(() => {
        if (editor === null) {
            return;
        }

        const model = editor.getModel();
        monaco.editor.setModelMarkers(model, "luau", markers);
    }, [editor, markers]);

    useEffect(updateMarkers, [editor, markers]);
    useEffect(() => {
        let hints = [];
        let deltaDecorations = [];

        for (const tys of typeLocations) {
            const location = tys.location;
            const id = tys.ty;
            const string = typeStrings[id];
            const different = previousTypeStrings ? previousTypeStrings[id] !== string : false;

            hints.push({
                position: {
                    lineNumber: location[2] + 1,
                    column: location[3] + 1,
                    paddingLeft: true,
                    paddingRight: true,
                },
                label: ": " + string,
            });

            if (different) {
                deltaDecorations.push({
                    // Add an extra column to encompass the inlay hint. This is
                    // kinda hacky, but it does work.
                    range: new monaco.Range(location[0] + 1, location[1] + 1, location[2] + 1, location[3] + 1),
                    options: {
                        className: "changedWithStepDecoration",
                    }
                });
            }
        }

        hintsProvider.setInlayHints(hints);

        if (editor !== null)
            editor.deltaDecorations([], deltaDecorations);
    }, [typeLocations, typeStrings, previousTypeStrings, editor]);

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
