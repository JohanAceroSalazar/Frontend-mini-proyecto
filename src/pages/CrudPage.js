import { FormRenderer } from "../components/FormRenderer.js";
import { TableRenderer } from "../components/TableRender.js";
import {
    createOrder,
    createProduct,
    createUser,
    deleteOrder,
    deleteProduct,
    deleteUser,
    getOrders,
    getProducts,
    getUsers,
    updateOrder,
    updateProduct,
    updateUser,
} from "../services/api.js";

const entityConfig = {
    users: {
        key: "users",
        title: "Usuarios",
        description: "Administra las personas que pueden generar pedidos.",
        singular: "usuario",
        load: getUsers,
        create: createUser,
        update: updateUser,
        remove: deleteUser,
        getInitialValues: () => ({
            name: "",
            age: "",
            email: "",
        }),
        fields: () => [
            { name: "name", label: "Nombre", type: "text", placeholder: "Ej. Maria Gomez" },
            { name: "age", label: "Edad", type: "number", placeholder: "Ej. 28", min: 0 },
            { name: "email", label: "Correo", type: "email", placeholder: "correo@ejemplo.com" },
        ],
        columns: [
            { key: "name", label: "Nombre" },
            { key: "age", label: "Edad" },
            { key: "email", label: "Correo" },
        ],
        toPayload: (values) => ({
            name: values.name.trim(),
            age: Number(values.age),
            email: values.email.trim(),
        }),
    },
    products: {
        key: "products",
        title: "Productos",
        description: "Mantiene el catalogo disponible para crear pedidos.",
        singular: "producto",
        load: getProducts,
        create: createProduct,
        update: updateProduct,
        remove: deleteProduct,
        getInitialValues: () => ({
            name: "",
            description: "",
            price: "",
        }),
        fields: () => [
            { name: "name", label: "Nombre", type: "text", placeholder: "Ej. Teclado mecanico" },
            { name: "description", label: "Descripcion", type: "text", placeholder: "Breve descripcion" },
            { name: "price", label: "Precio", type: "number", placeholder: "Ej. 149900", min: 0, step: "0.01" },
        ],
        columns: [
            { key: "name", label: "Nombre" },
            { key: "description", label: "Descripcion" },
            { key: "price", label: "Precio" },
        ],
        toPayload: (values) => ({
            name: values.name.trim(),
            description: values.description.trim(),
            price: Number(values.price),
        }),
    },
    orders: {
        key: "orders",
        title: "Pedidos",
        description: "Relaciona usuarios con productos y registra el total.",
        singular: "pedido",
        load: getOrders,
        create: createOrder,
        update: updateOrder,
        remove: deleteOrder,
        getInitialValues: () => ({
            userId: "",
            productId: "",
            total: "",
        }),
        fields: (state) => [
            {
                name: "userId",
                label: "Usuario",
                type: "select",
                placeholder: "Selecciona un usuario",
                options: state.users.map((user) => ({
                    value: user.id,
                    label: `${user.name} - ${user.email}`,
                })),
            },
            {
                name: "productId",
                label: "Producto",
                type: "select",
                placeholder: "Selecciona un producto",
                options: state.products.map((product) => ({
                    value: product.id,
                    label: `${product.name} - $${product.price}`,
                })),
            },
            { name: "total", label: "Total", type: "number", placeholder: "Ej. 249900", min: 0, step: "0.01" },
        ],
        columns: [
            { key: "userName", label: "Usuario" },
            { key: "productName", label: "Producto" },
            { key: "total", label: "Total" },
        ],
        toPayload: (values) => ({
            userId: values.userId,
            productId: values.productId,
            total: Number(values.total),
        }),
    },
};

const state = {
    currentView: "users",
    users: [],
    products: [],
    orders: [],
    selectedId: null,
    message: "",
    error: "",
};

function getCurrentConfig() {
    return entityConfig[state.currentView];
}

function getCurrentRows() {
    return state[state.currentView];
}

function getSelectedRecord() {
    if (!state.selectedId) {
        return null;
    }

    return getCurrentRows().find((item) => item.id === state.selectedId) || null;
}

function getCurrentValues() {
    const currentConfig = getCurrentConfig();
    return getSelectedRecord() || currentConfig.getInitialValues();
}

function renderSummaryCard(title, count, tone) {
    return `
    <article class="summary-card ${tone}">
        <p>${title}</p>
        <strong>${count}</strong>
    </article>
    `;
}

function renderTabs() {
    return `
    <nav class="tabs">
        ${Object.values(entityConfig)
            .map(
                (config) => `
                <button
                    class="tab ${state.currentView === config.key ? "active" : ""}"
                    onclick="window.changeView('${config.key}')"
                >
                    ${config.title}
                </button>
            `
            )
            .join("")}
    </nav>
    `;
}

function renderFeedback() {
    if (state.error) {
        return `<div class="feedback error">${state.error}</div>`;
    }

    if (state.message) {
        return `<div class="feedback success">${state.message}</div>`;
    }

    return "";
}

function buildLayout() {
    const currentConfig = getCurrentConfig();
    const currentRows = getCurrentRows();

    return `
    <main class="shell">
        <section class="hero">
            <div>
                <p class="eyebrow">Mini Proyecto</p>
                <h1>Panel CRUD conectado a tu backend Spring</h1>
                <p class="hero-copy">
                    Gestiona usuarios, productos y pedidos desde una sola interfaz, consumiendo las rutas de tu API en el puerto 8084.
                </p>
            </div>
            <div class="summary-grid">
                ${renderSummaryCard("Usuarios", state.users.length, "tone-coral")}
                ${renderSummaryCard("Productos", state.products.length, "tone-gold")}
                ${renderSummaryCard("Pedidos", state.orders.length, "tone-ink")}
            </div>
        </section>

        ${renderTabs()}

        <section class="workspace-header">
            <div>
                <h2>${currentConfig.title}</h2>
                <p>${currentConfig.description}</p>
            </div>
        </section>

        ${renderFeedback()}

        <section class="workspace-grid">
            ${FormRenderer({
                title: `Formulario de ${currentConfig.singular}`,
                fields: currentConfig.fields(state),
                values: getCurrentValues(),
                isEditing: Boolean(state.selectedId),
            })}
            ${TableRenderer({
                columns: currentConfig.columns,
                rows: currentRows,
                entityKey: currentConfig.key,
                emptyMessage: `Todavia no hay ${currentConfig.title.toLowerCase()} cargados.`,
            })}
        </section>
    </main>
    `;
}

function renderApp() {
    const app = document.getElementById("app");
    app.innerHTML = buildLayout();
}

async function loadAllData() {
    const [users, products, orders] = await Promise.all([
        entityConfig.users.load(),
        entityConfig.products.load(),
        entityConfig.orders.load(),
    ]);

    state.users = users;
    state.products = products;
    state.orders = orders;
}

function readFieldValues(fields) {
    return fields.reduce((values, field) => {
        values[field.name] = document.getElementById(field.name)?.value || "";
        return values;
    }, {});
}

function validatePayload(entityKey, payload) {
    if (entityKey === "users") {
        if (!payload.name || !payload.email || Number.isNaN(payload.age)) {
            throw new Error("Completa nombre, edad y correo del usuario.");
        }
    }

    if (entityKey === "products") {
        if (!payload.name || !payload.description || Number.isNaN(payload.price)) {
            throw new Error("Completa nombre, descripcion y precio del producto.");
        }
    }

    if (entityKey === "orders") {
        if (!payload.userId || !payload.productId || Number.isNaN(payload.total)) {
            throw new Error("Selecciona usuario, producto y total del pedido.");
        }
    }
}

export async function renderCrud() {
    const app = document.getElementById("app");
    app.innerHTML = `<main class="shell"><div class="loading">Cargando datos del backend...</div></main>`;

    window.changeView = changeView;
    window.handleSave = handleSave;
    window.editItem = editItem;
    window.deleteItem = handleDelete;
    window.clearForm = clearForm;

    try {
        await loadAllData();
        renderApp();
    } catch (error) {
        app.innerHTML = `
        <main class="shell">
            <section class="panel">
                <h1>No pude conectar con el backend</h1>
                <p>${error.message}</p>
                <p>Verifica que Spring este corriendo en http://localhost:8084</p>
            </section>
        </main>
        `;
    }
}

async function handleSave() {
    const currentConfig = getCurrentConfig();

    try {
        state.error = "";
        state.message = "";

        const values = readFieldValues(currentConfig.fields(state));
        const payload = currentConfig.toPayload(values);
        validatePayload(currentConfig.key, payload);

        if (state.selectedId) {
            await currentConfig.update(state.selectedId, payload);
            state.message = `${currentConfig.title.slice(0, -1)} actualizado correctamente.`;
        } else {
            await currentConfig.create(payload);
            state.message = `${currentConfig.title.slice(0, -1)} creado correctamente.`;
        }

        state.selectedId = null;
        await loadAllData();
        renderApp();
    } catch (error) {
        state.error = error.message || "No fue posible guardar el registro.";
        renderApp();
    }
}

function changeView(view) {
    state.currentView = view;
    state.selectedId = null;
    state.error = "";
    state.message = "";
    renderApp();
}

function editItem(entityKey, id) {
    state.currentView = entityKey;
    state.selectedId = id;
    state.error = "";
    state.message = "";
    renderApp();
}

async function handleDelete(entityKey, id) {
    const currentConfig = entityConfig[entityKey];

    try {
        state.currentView = entityKey;
        state.error = "";
        state.message = "";
        await currentConfig.remove(id);
        state.selectedId = state.selectedId === id ? null : state.selectedId;
        state.message = `${currentConfig.singular} eliminado correctamente.`;
        await loadAllData();
        renderApp();
    } catch (error) {
        state.error = error.message || "No fue posible eliminar el registro.";
        renderApp();
    }
}

function clearForm() {
    state.selectedId = null;
    state.error = "";
    state.message = "";
    renderApp();
}
