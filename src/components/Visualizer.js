import { useState, useEffect } from "react";
import { Alert, Button, ButtonGroup, Container, InputGroup, Row } from "react-bootstrap";
import { ScopeView } from "./ScopeView";

export function Visualizer(props) {
    const usable = props.data !== null;
    const [index, setIndex] = useState(0);
    const currentData = props.data ? props.data[index] : null;

    useEffect(() => {
        if (currentData === null)
            return;
        
        hpccWasm.graphviz.layout(currentData.constraintGraph, "svg", "dot").then(svg => {
            const graphroot = document.getElementById("graphroot");
            graphroot.innerHTML = svg;
        });
    }, [currentData]);

    if (!usable) {
        return <Alert variant="danger">You must supply input before this tab is usable.</Alert>
    }

    const decrementIndex = () => {
        setIndex((prevCount) => Math.max(0, prevCount - 1));
    }

    const incrementIndex = () => {
        setIndex((prevCount) => Math.min(props.data.length - 1, prevCount + 1));
    }

    let current = null;
    if (currentData.type == "step") {
        current = <>
            <p>Currently dispatching:</p>
            <pre>{currentData.current}</pre>
        </>
    } else if (currentData.type == "boundary") {
        if (index == 0) {
            current = <p>Currently inspecting the initial state.</p>
        } else {
            current = <p>Currently inspecting the final state.</p>
        }
    }

    return <>
        <Container>
            <Row>
                <ButtonGroup>
                    <Button disabled={!usable} variant="primary" onClick={decrementIndex}>Go back</Button>
                    <InputGroup.Text>{index}</InputGroup.Text>
                    <Button disabled={!usable} variant="primary" onClick={incrementIndex}>Go forward</Button>
                </ButtonGroup>
            </Row>
            <Row>
                {current}
            </Row>
            <Row>
                <h2>Current scope tree</h2>
                <ScopeView scope={currentData.rootScope} />
            </Row>
            <Row>
                <h2>Constraint graph</h2>
                <div id="graphroot">
                </div>
            </Row>
        </Container>
    </>
}
