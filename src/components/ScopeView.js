import { useState } from "react";

export function ScopeView({ scope }) {
    let bindings = null;
    if (Object.keys(scope.bindings).length > 0) {
        let bindingItems = [];

        for (const bindingName in scope.bindings) {
            bindingItems.push(<li key={bindingName}>
                <pre>{bindingName} : {scope.bindings[bindingName]}</pre>
            </li>)
        }

        bindings = <div>
            <p>Bindings:</p>
            <ul>
                {bindingItems}
            </ul>
        </div>
    }

    let childScopes = null;
    if (scope.children.length > 0) {
        let scopeItems = [];

        for (const childScope in scope.children) {
            scopeItems.push(<li key={childScope}><ScopeView scope={scope.children[childScope]} /></li>)
        }

        childScopes = <div>
            <p>Child scopes:</p>
            <ul>
                {scopeItems}
            </ul>
        </div>
    }

    return <div>
        {bindings}
        {childScopes}
    </div>
}
