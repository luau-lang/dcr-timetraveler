import { useState, useEffect } from "react";
import { Alert, Button, ButtonGroup, InputGroup, Table } from "react-bootstrap";

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

    const bindingRows = [];
    for (const binding in currentData.rootScope.bindings) {
        bindingRows.push(<tr key={binding}>
            <td>{binding}</td>
            <td>{currentData.rootScope.bindings[binding]}</td>
        </tr>)
    }

    return <>
        <Table>
            <thead>
                <tr>
                    <th>Binding name</th>
                    <th>Binding type</th>
                </tr>
            </thead>
            <tbody>
                {bindingRows}
            </tbody>
        </Table>
        <p>Current: {currentData.current}</p>
        <div id="graphroot">
        </div>
        <ButtonGroup>
            <Button disabled={!usable} variant="primary" onClick={decrementIndex}>Go back</Button>
            <InputGroup.Text>{index}</InputGroup.Text>
            <Button disabled={!usable} variant="primary" onClick={incrementIndex}>Go forward</Button>
        </ButtonGroup>
    </>
}
