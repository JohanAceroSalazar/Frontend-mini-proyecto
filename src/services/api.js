const BASE_URL = window.__API_URL__ || "http://localhost:8084";

async function request(path, options = {}) {
    const response = await fetch(`${BASE_URL}${path}`, {
        headers: {
            "Content-Type": "application/json",
            ...(options.headers || {}),
        },
        ...options,
    });

    const text = await response.text();
    let data = null;

    if (text) {
        try {
            data = JSON.parse(text);
        } catch {
            data = text;
        }
    }

    if (!response.ok) {
        throw new Error((typeof data === "object" && data?.message) || data || `Error ${response.status}`);
    }

    return data;
}

function normalizeUser(user) {
    return {
        id: user.idUser,
        name: user.name || "",
        age: user.age ?? "",
        email: user.email || "",
        createdAt: user.createdAt || "",
        updatedAt: user.updatedAt || "",
    };
}

function normalizeProduct(product) {
    return {
        id: product.idProduct,
        name: product.name || "",
        description: product.description || "",
        price: product.price ?? "",
        createdAt: product.createdAt || "",
        updatedAt: product.updatedAt || "",
    };
}

function normalizeOrder(order) {
    return {
        id: order.idOrder,
        total: order.total ?? "",
        userId: order.user?.idUser || "",
        userName: order.user?.name || "Sin usuario",
        productId: order.product?.idProduct || "",
        productName: order.product?.name || "Sin producto",
        createdAt: order.createdAt || "",
        updatedAt: order.updatedAt || "",
    };
}

export async function getUsers() {
    const data = await request("/users");
    return data.map(normalizeUser);
}

export async function createUser(payload) {
    return request("/users", {
        method: "POST",
        body: JSON.stringify(payload),
    });
}

export async function updateUser(id, payload) {
    return request(`/users/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
    });
}

export async function deleteUser(id) {
    return request(`/users/${id}`, {
        method: "DELETE",
    });
}

export async function getProducts() {
    const data = await request("/products");
    return data.map(normalizeProduct);
}

export async function createProduct(payload) {
    return request("/products", {
        method: "POST",
        body: JSON.stringify(payload),
    });
}

export async function updateProduct(id, payload) {
    return request(`/products/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
    });
}

export async function deleteProduct(id) {
    return request(`/products/${id}`, {
        method: "DELETE",
    });
}

export async function getOrders() {
    const data = await request("/orders");
    return data.map(normalizeOrder);
}

export async function createOrder(payload) {
    return request("/orders", {
        method: "POST",
        body: JSON.stringify(payload),
    });
}

export async function updateOrder(id, payload) {
    return request(`/orders/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
    });
}

export async function deleteOrder(id) {
    return request(`/orders/${id}`, {
        method: "DELETE",
    });
}
