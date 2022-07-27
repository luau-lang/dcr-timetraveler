import { useState, useEffect } from "react";
import { Alert, Button, ButtonGroup, Container, InputGroup, Row } from "react-bootstrap";
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

    const maxIndex = props.data.solve.stepStates.length;
    let currentData = null;
    if (index == 0)
        currentData = props.data.solve.initialState;
    else if (index == maxIndex)
        currentData = props.data.solve.finalState;
    else
        currentData = props.data.solve.stepStates[index];
    
    const updateIndex = (mapper) => {
        setLastIndex(index);
        setIndex((prevIndex) => Math.max(0, Math.min(maxIndex, mapper(prevIndex))));
    };

    const decrementIndex = () => updateIndex((prevIndex) => prevIndex - 1);
    const incrementIndex = () => updateIndex((prevIndex) => prevIndex + 1);
    const goToInitial = () => updateIndex(() => 0);
    const goToFinal = () => updateIndex(() => maxIndex);

    const currentConstraints = (index == 0 || index == maxIndex) ? currentData.constraints : currentData.unsolvedConstraints;
    let lastConstraints = null;
    if (lastIndex === 0)
        lastConstraints = props.data.solve.initialState.constraints;
    else if (lastIndex === maxIndex)
        lastConstraints = props.data.solve.finalState.constraints;
    else if (lastIndex !== null)
        lastConstraints = props.data.solve.stepStates[lastIndex].unsolvedConstraints;

    let current = null;
    if (index > 0 && index < maxIndex) {
        const constraintString = currentData.unsolvedConstraints[currentData.currentConstraint].stringification;
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
                {current}
            </Row>
            <Row>
                <h2>Source code</h2>
                <SourceCodeView source={props.data.generation.source} />
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
