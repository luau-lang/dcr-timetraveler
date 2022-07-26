import Accordion from "react-bootstrap/Accordion";

export function ScopeView({ scope }) {
    let bindings = null;
    if (Object.keys(scope.bindings).length > 0) {
        let bindingItems = [];

        for (const bindingName in scope.bindings) {
            bindingItems.push(<li key={bindingName}>
                <pre>{bindingName} : {scope.bindings[bindingName].typeString}</pre>
            </li>)
        }

        let typeBindings = [];
        let typePackBindings = [];

        for (const bindingName in scope.typeBindings) {
            typeBindings.push(<li key={bindingName}>
                <pre>{bindingName} : {scope.typeBindings[bindingName].typeString}</pre>
            </li>)
        }

        for (const bindingName in scope.typePackBindings) {
            typePackBindings.push(<li key={bindingName}>
                <pre>{bindingName} : {scope.typePackBindings[bindingName].typeString}</pre>
            </li>)
        }

        bindings = <Accordion.Item eventKey="0">
            <Accordion.Header>
                Bindings
            </Accordion.Header>
            <Accordion.Body>
                <ul>{bindingItems}</ul>
            </Accordion.Body>
        </Accordion.Item>
    }

    let childScopes = null;
    if (scope.children.length > 0) {
        let scopeItems = [];

        for (const childScope in scope.children) {
            scopeItems.push(<li key={childScope}><ScopeView scope={scope.children[childScope]} /></li>)
        }

        childScopes = <Accordion.Item eventKey="1">
            <Accordion.Header>
                Child scopes
            </Accordion.Header>
            <Accordion.Body>
                <ul>{scopeItems}</ul>
            </Accordion.Body>
        </Accordion.Item>
    }

    return <Accordion alwaysOpen>
        {bindings}
        {childScopes}
    </Accordion>
}
