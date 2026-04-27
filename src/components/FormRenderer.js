function renderField(field, values) {
    const value = values[field.name] ?? "";

    if (field.type === "select") {
        const options = field.options
            .map((option) => {
                const selected = value === option.value ? "selected" : "";
                return `<option value="${option.value}" ${selected}>${option.label}</option>`;
            })
            .join("");

        return `
        <label class="field">
            <span>${field.label}</span>
            <select id="${field.name}">
                <option value="">${field.placeholder || "Selecciona una opcion"}</option>
                ${options}
            </select>
        </label>
        `;
    }

    return `
    <label class="field">
        <span>${field.label}</span>
        <input
            id="${field.name}"
            type="${field.type}"
            placeholder="${field.placeholder || ""}"
            value="${value}"
            ${field.min !== undefined ? `min="${field.min}"` : ""}
            ${field.step !== undefined ? `step="${field.step}"` : ""}
        >
    </label>
    `;
}

export function FormRenderer({ title, fields, values, isEditing }) {
    return `
    <section class="panel form-panel">
        <div class="panel-heading">
            <div>
                <p class="eyebrow">Formulario</p>
                <h2>${title}</h2>
            </div>
            <span class="badge">${isEditing ? "Editando" : "Nuevo registro"}</span>
        </div>
        <div class="form-grid">
            ${fields.map((field) => renderField(field, values)).join("")}
        </div>
        <div class="actions">
            <button class="primary-button" onclick="window.handleSave()">Guardar</button>
            <button class="ghost-button" onclick="window.clearForm()">Limpiar</button>
        </div>
    </section>
    `;
}
