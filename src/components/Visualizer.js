import { useState, useEffect } from "react";
import { Alert, Button, ButtonGroup, Container, InputGroup, Row } from "react-bootstrap";
import { ScopeView } from "./ScopeView";

export function Visualizer(props) {
    const usable = props.data !== null;
    const [index, setIndex] = useState(0);

    if (!usable) {
        return <Alert variant="danger">You must supply input before this tab is usable.</Alert>
    }

    let currentData = null;
    const maxIndex = props.data.solve.stepStates.length;
    const boundary = index == 0 || index == maxIndex;

    if (index == 0)
        currentData = props.data.solve.initialState;
    else if (index == maxIndex)
        currentData = props.data.solve.finalState;
    else
        currentData = props.data.solve.stepStates[index];

    const decrementIndex = () => {
        setIndex((prevCount) => Math.max(0, prevCount - 1));
    }

    const incrementIndex = () => {
        setIndex((prevCount) => Math.min(maxIndex, prevCount + 1));
    }

    const goToInitial = () => {
        setIndex(0);
    }

    const goToFinal = () => {
        setIndex(maxIndex);
    }

    let current = null;
    if (index > 0 && index < maxIndex) {
        const constraintString = currentData.unsolvedConstraints[currentData.currentConstraint];
        current = <>
            <p>Currently dispatching:</p>
            <pre>{constraintString}</pre>
        </>
    } else {
        if (index == 0) {
            current = <p>Currently inspecting the initial state.</p>
        } else {
            current = <p>Currently inspecting the final state.</p>
        }
    }

    let currentConstraints = [];

    if (boundary) {
        for (const id in currentData.constraints) {
            const stringified = currentData.constraints[id];
            currentConstraints.push(<li key={id}><pre>{stringified}</pre></li>);
        }
    } else {
        for (const id in currentData.unsolvedConstraints) {
            const stringified = currentData.unsolvedConstraints[id];
            currentConstraints.push(<li key={id}><pre>{stringified}</pre></li>);
        }
    }

    let constraintsDisplay = <ul>{currentConstraints}</ul>;
    if (currentConstraints.length == 0) {
        constraintsDisplay = <p>No constraints remain to be solved.</p>
    }

    let displayedIndex = "Step " + index;
    if (index == 0) {
        displayedIndex = "Initial";
    } else if (index == maxIndex) {
        displayedIndex = "Final";
    }

    return <>
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
                {current}
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
    </>
}
