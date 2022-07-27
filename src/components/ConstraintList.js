export function ConstraintList({ constraints, previousConstraints }) {
    if (Object.keys(constraints).length == 0)
        return <p>No constraints remain.</p>;

    let listItems = [];

    for (const constraintId in constraints) {
        let currentValue = constraints[constraintId];
        let previousValue = previousConstraints ? previousConstraints[constraintId] : null;

        const currentString = currentValue.stringification;
        const previousString = previousValue ? previousValue.stringification : null;

        let blocked = [];
        for (const block of currentValue.blocks) {
            blocked.push(<li>({block.kind})<pre>{block.stringification}</pre></li>);
        }

        let blockedList = blocked.length > 0 ? <div><p>Blocked on:<ul>{blocked}</ul></p></div> : null;

        if (currentString == previousString || previousString === null) {
            listItems.push(<li key={constraintId}><pre>{currentString}</pre>{blockedList}</li>);
        } else if (previousString !== null) {
            listItems.push(<li key={constraintId}><pre className="changed">{currentString}</pre>{blockedList}</li>);
        }
    }

    return <ul>
        {listItems}
    </ul>
}
