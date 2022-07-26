export function ConstraintList({ constraints, previousConstraints }) {
    if (Object.keys(constraints).length == 0)
        return <p>No constraints remain.</p>;

    let listItems = [];

    for (const constraintId in constraints) {
        let currentValue = constraints[constraintId];
        let previousValue = previousConstraints !== null ? previousConstraints[constraintId] : null;

        if (currentValue == previousValue) {
            listItems.push(<li key={constraintId}><pre>{currentValue}</pre></li>);
        } else if (previousValue !== null) {
            listItems.push(<li key={constraintId}><pre className="changed">{currentValue}</pre></li>);
        }
    }

    return <ul>
        {listItems}
    </ul>
}
