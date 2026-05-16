import { useCallback, useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import { language } from "../LuauMonarch";
import { EventEmitter } from "events";

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

export function SourceCodeView({ markers, source, typeLocations, typeStrings, previousTypeStrings }) {
    const [editor, setEditor] = useState(null);

    function editorWillMount(ed) {
        setEditor(ed);

        monaco.languages.register({
            id: "luau",
            aliases: ["Luau", "luau"],
        });

        monaco.languages.setMonarchTokensProvider("luau", language);
        monaco.languages.registerInlayHintsProvider("luau", hintsProvider);
    }

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

    return <Editor
        height="500px"
        language="luau"
        value={source}
        onMount={editorWillMount}
        options={{
            scrollBeyondLastLine: false,
            scrollBeyondLastColumn: false,
            minimap: {
                enabled: false,
            }
        }}
        />;

    // return (
    //     <Editor
    //         height="400"
    //         language="luau"
    //         value={source}
    //         options={{
    //             scrollBeyondLastLine: false,
    //             scrollBeyondLastColumn: false,
    //             minimap: {
    //                 enabled: false,
    //             }
    //         }}
    //         onMount={editorWillMount}
    //     />
    // );
}
