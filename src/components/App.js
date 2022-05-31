import { useState } from "react";
import { Alert, Button, Tab, Tabs, Form } from "react-bootstrap";
import { Visualizer } from "./Visualizer";

export function App() {
    const [rawInput, setRawInput] = useState("");
    const [input, setInput] = useState(null);
    const [inputError, setInputError] = useState(null);

    const applyInput = () => {
        try {
            setInput(JSON.parse(rawInput));
            setInputError(null);
        } catch (e) {
            console.error(e);
            setInputError(e.toString());
        }
    }

    const errorElement = inputError === null ? null : <Alert variant="danger">{inputError}</Alert>

    return <>
        {errorElement}
        <Tabs defaultActiveKey="input" className="mb-3">
            <Tab eventKey="input" title="Input">
                <Form.Control as="textarea" value={rawInput} onChange={(e) => setRawInput(e.target.value)} />
                <Button variant="primary" onClick={applyInput}>Apply</Button>
            </Tab>
            <Tab eventKey="visualize" title="Visualize">
                <Visualizer data={input} />
            </Tab>
        </Tabs>
    </>
}
