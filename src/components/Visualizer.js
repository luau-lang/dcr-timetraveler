import { useState, useEffect } from "react";
import { Alert, Button, ButtonGroup, Container, InputGroup, Row } from "react-bootstrap";
import { monaco } from "react-monaco-editor";
import { ConstraintList } from "./ConstraintList";
import { ScopeView } from "./ScopeView";
import { SourceCodeView } from "./SourceCodeView";

export function Visualizer(props) {
    const usable = props.data !== null;
    const [index, setIndex] = useState(0);
    const [lastIndex, setLastIndex] = useState(null);

    if (!usable) {
        return <Alert variant="danger">You must supply input before this tab is usable.</Alert>
    }

    const maxIndex = props.data.solve.stepStates.length + 1;
    let currentData = null;
    if (index == 0)
        currentData = props.data.solve.initialState;
    else if (index == maxIndex)
        currentData = props.data.solve.finalState;
    else
        currentData = props.data.solve.stepStates[index - 1];

    let lastData = null;
    if (lastIndex == 0)
        lastData = props.data.solve.initialState;
    else if (lastIndex == maxIndex)
        lastData = props.data.solve.finalState;
    else if (lastIndex !== null)
        lastData = props.data.solve.stepStates[lastIndex - 1];

    const updateIndex = (mapper) => {
        setLastIndex(index);
        setIndex((prevIndex) => Math.max(0, Math.min(maxIndex, mapper(prevIndex))));
    };

    const decrementIndex = () => updateIndex((prevIndex) => prevIndex - 1);
    const incrementIndex = () => updateIndex((prevIndex) => prevIndex + 1);
    const goToInitial = () => updateIndex(() => 0);
    const goToFinal = () => updateIndex(() => maxIndex);

    const currentConstraints = currentData.unsolvedConstraints;
    let lastConstraints = lastData ? lastData.unsolvedConstraints : null;

    let currentConstraint = null;
    let currentConstraintDisplay = null;
    if (index > 0 && index < maxIndex) {
        currentConstraint = currentData.unsolvedConstraints[currentData.currentConstraint];
        const header = currentData.force ? <p>Currently <strong>force</strong> dispatching:</p> : <p>Currently dispatching:</p>
        currentConstraintDisplay = <>
            {header}
            <pre>{currentConstraint.stringification}</pre>
        </>
    } else {
        if (index == 0) {
            currentConstraintDisplay = <p>Currently inspecting the initial state.</p>
        } else {
            currentConstraintDisplay = <p>Currently inspecting the final state.</p>
        }
    }

    let constraintsDisplay = <ConstraintList constraints={currentConstraints} previousConstraints={lastConstraints} />;
    if (currentConstraints.length == 0) {
        constraintsDisplay = <p>No constraints remain to be solved.</p>
    }

    let displayedIndex = "Step " + index;
    if (index == 0) {
        displayedIndex = "Initial";
    } else if (index == maxIndex) {
        displayedIndex = "Final";
    }

    let markers = [];
    for (const e of props.data.generation.errors) {
        markers.push({
            message: e.message,
            startLineNumber: e.location[0] + 1,
            startColumn: e.location[1] + 1,
            endLineNumber: e.location[2] + 1,
            endColumn: e.location[3] + 1,
        });
    }

    for (const e of props.data.check.errors) {
        markers.push({
            message: e.message,
            severity: monaco.MarkerSeverity.Error,
            startLineNumber: e.location[0] + 1,
            startColumn: e.location[1] + 1,
            endLineNumber: e.location[2] + 1,
            endColumn: e.location[3] + 1,
        });
    }

    if (currentConstraint !== null) {
        const {stringification, location} = currentConstraint;
        markers.push({
            message: stringification,
            severity: monaco.MarkerSeverity.Info,
            startLineNumber: location[0] + 1,
            startColumn: location[1] + 1,
            endLineNumber: location[2] + 1,
            endColumn: location[3] + 1,
        });
    }

    return (
        <Container>
            <Row>
                <ButtonGroup>
                    <Button disabled={!usable} variant="primary" onClick={goToInitial}>Initial state</Button>
                    <Button disabled={!usable} variant="primary" onClick={decrementIndex}>Go back</Button>
                    <InputGroup.Text>{displayedIndex}</InputGroup.Text>
                    <Button disabled={!usable} variant="primary" onClick={incrementIndex}>Go forward</Button>
                    <Button disabled={!usable} variant="primary" onClick={goToFinal}>Final state</Button>
                </ButtonGroup>
            </Row>
            <Row>
                <h2>Source code</h2>
                <SourceCodeView markers={markers} source={props.data.generation.source} typeLocations={props.data.generation.exprTypeLocations} typeStrings={currentData.typeStrings} previousTypeStrings={lastData?.typeStrings} />
            </Row>
            <Row>
                {currentConstraintDisplay}
            </Row>
            <Row>
                <h2>Unsolved constraints</h2>
                {constraintsDisplay}
            </Row>
            <Row>
                <h2>Current scope tree</h2>
                <ScopeView scope={currentData.rootScope} />
            </Row>
        </Container>
    );
}
