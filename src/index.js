import 'bootstrap/dist/css/bootstrap.min.css';
import ReactDOM from "react-dom";
import { App } from "./components/App";

// @ts-ignore
import JSONWorker from 'url:monaco-editor/esm/vs/language/json/json.worker.js';
// @ts-ignore
import CSSWorker from 'url:monaco-editor/esm/vs/language/css/css.worker.js';
// @ts-ignore
import HTMLWorker from 'url:monaco-editor/esm/vs/language/html/html.worker.js';
// @ts-ignore
import TSWorker from 'url:monaco-editor/esm/vs/language/typescript/ts.worker.js';
// @ts-ignore
import EditorWorker from 'url:monaco-editor/esm/vs/editor/editor.worker.js';
import * as monaco from 'monaco-editor';

window.MonacoEnvironment = {
  getWorkerUrl: function (_moduleId, label) {
    if (label === 'json') {
      return JSONWorker;
    }
    if (label === 'css' || label === 'scss' || label === 'less') {
      return CSSWorker;
    }
    if (label === 'html' || label === 'handlebars' || label === 'razor') {
      return HTMLWorker;
    }
    if (label === 'typescript' || label === 'javascript') {
      return TSWorker;
    }
    return EditorWorker;
  },
};

const root = document.getElementById("root");
ReactDOM.render(<App />, root);
