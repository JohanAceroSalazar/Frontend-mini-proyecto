function formatValue(value) {
    if (value === null || value === undefined || value === "") {
        return " - ";
    }

    return value;
}

export function TableRenderer({ columns, rows, emptyMessage, entityKey }) {
    if (!rows.length) {
        return `
        <section class="panel table-panel">
            <div class="empty-state">
                <h3>Sin registros</h3>
                <p>${emptyMessage}</p>
            </div>
        </section>
        `;
    }

    return `
    <section class="panel table-panel">
        <div class="table-wrap">
            <table>
                <thead>
                    <tr>
                        ${columns.map((column) => `<th>${column.label}</th>`).join("")}
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    ${rows
                        .map(
                            (row) => `
                            <tr>
                                ${columns
                                    .map((column) => `<td>${formatValue(row[column.key])}</td>`)
                                    .join("")}
                                <td class="actions-cell">
                                    <button class="table-button edit-button" onclick="window.editItem('${entityKey}', '${row.id}')">Editar</button>
                                    <button class="table-button delete-button" onclick="window.deleteItem('${entityKey}', '${row.id}')">Eliminar</button>
                                </td>
                            </tr>
                        `
                        )
                        .join("")}
                </tbody>
            </table>
        </div>
    </section>
    `;
}
