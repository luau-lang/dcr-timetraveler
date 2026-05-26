import 'bootstrap/dist/css/bootstrap.min.css';
import ReactDOM from "react-dom/client";
import { App } from "./components/App";

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

const domRoot = document.getElementById("root");
const root = ReactDOM.createRoot(domRoot);
root.render(<App />);
