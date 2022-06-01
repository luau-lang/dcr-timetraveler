import { useState } from "react";
import { Alert, Button, Tab, Tabs, Form, Container, Row } from "react-bootstrap";
import { Visualizer } from "./Visualizer";

export function App() {
    const [rawInput, setRawInput] = useState("");
    const [input, setInput] = useState(null);
    const [inputError, setInputError] = useState(null);
    const [activeTab, setActiveTab] = useState("input");

    const applyInput = () => {
        try {
            setInput(JSON.parse(rawInput));
            setInputError(null);
            setActiveTab("visualize");
        } catch (e) {
            console.error(e);
            setInputError(e.toString());
        }
    }

    const errorElement = inputError === null ? null : <Alert variant="danger">{inputError}</Alert>

    return <>
        <Tabs activeKey={activeTab} onSelect={(t, _) => setActiveTab(t)} className="mb-3">
            <Tab eventKey="input" title="Input">
                <Container>
                    <Row>
                        {errorElement}
                    </Row>
                    <Row>
                        <Form.Control as="textarea" value={rawInput} onChange={(e) => setRawInput(e.target.value)} rows={20} />
                    </Row>
                    <Row>
                        <Button variant="primary" onClick={applyInput}>Apply</Button>
                    </Row>
                </Container>
            </Tab>
            <Tab eventKey="visualize" title="Visualize" disabled={input === null}>
                <Visualizer data={input} />
            </Tab>
        </Tabs>
    </>
}
