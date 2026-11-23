let productCatalog = [
    {
        id: "PASS-ALL",
        title: "Full Access Conference Pass",
        category: "Admission Pass",
        format: "Multi-Day All-Access",
        price: 299.0,
        additionalInfo: "Includes Keynotes, Breakouts, and Networking Reception",
    },
    {
        id: "WORK-CLOUD",
        title: "Cloud Native Architecture Workshop",
        category: "Workshop Add-on",
        format: "Single-Day Intensive",
        price: 99.5,
        additionalInfo: "Includes Hands-On Lab Access & Digital Course Material",
    },
    {
        id: "PASS-VIRTUAL",
        title: "Virtual Livestream & On-Demand Pass",
        category: "Admission Pass",
        format: "Digital Streaming",
        price: 49.0,
        additionalInfo: "Live Streamed Sessions + 90-Day Recording Archive",
    },
    {
        id: "SWAG-VIP",
        title: "VIP Speaker Luncheon & Swag Pack",
        category: "Merchandise & Perks",
        format: "Physical Badge & Pack",
        price: 39.99,
        additionalInfo: "Commemorative T-Shirt (Size L) & Luncheon Ticket",
    },
];

let shoppingCart = [];

const productForm = document.getElementById("productForm");
const productIdInput = document.getElementById("productId");
const productTitleInput = document.getElementById("productTitle");
const productCategoryInput = document.getElementById("productCategory");
const productFormatInput = document.getElementById("productFormat");
const productPriceInput = document.getElementById("productPrice");
const productAdditionalInput = document.getElementById("productAdditional");
const productErrorAlert = document.getElementById("productErrorAlert");
const catalogContainer = document.getElementById("catalogContainer");
const cartTableBody = document.getElementById("cartTableBody");
const cartSubtotalEl = document.getElementById("cartSubtotal");
const cartTaxEl = document.getElementById("cartTax");
const cartTotalEl = document.getElementById("cartTotal");
const cartJsonOutput = document.getElementById("cartJsonOutput");
const navCartCount = document.getElementById("navCartCount");
const checkoutBtn = document.getElementById("checkoutBtn");
const ajaxResponseAlert = document.getElementById("ajaxResponseAlert");

document.addEventListener("DOMContentLoaded", function () {
    renderCatalog(productCatalog);
    updateCartUI();
});

productForm.addEventListener("submit", function (e) {
    e.preventDefault();

    productErrorAlert.classList.add("d-none");
    productErrorAlert.innerHTML = "";

    const id = productIdInput.value.trim().toUpperCase();
    const title = productTitleInput.value.trim();
    const category = productCategoryInput.value.trim();
    const format = productFormatInput.value.trim();
    const priceStr = productPriceInput.value.trim();
    const additional = productAdditionalInput.value.trim();

    const errors = [];

    const skuRegex = /^[A-Z0-9]{3,8}-[A-Z0-9]{2,6}$/;
    if (!skuRegex.test(id)) {
        errors.push(
            "Item SKU / ID must follow the standard hyphenated format (e.g., PASS-DEV or WRK-101).",
        );
    }

    if (title.length < 5) {
        errors.push(
            "Item Title / Description must be at least 5 characters in length.",
        );
    }

    if (!category) {
        errors.push("Please select an Item Category.");
    }

    if (!format) {
        errors.push("Please select a Unit of Measure / Format.");
    }

    const parsedPrice = parseFloat(priceStr);
    if (priceStr === "" || isNaN(parsedPrice) || parsedPrice < 0) {
        errors.push(
            "Unit Price must be a valid non-negative number (enter 0 for free passes).",
        );
    }

    const duplicate = productCatalog.some((item) => item.id.toUpperCase() === id);
    if (duplicate) {
        errors.push(`An item with SKU "${id}" already exists in the catalog.`);
    }
    if (errors.length > 0) {
        productErrorAlert.innerHTML = errors
            .map((err) => `<div>&bull; ${err}</div>`)
            .join("");
        productErrorAlert.classList.remove("d-none");
        return;
    }

    const newProduct = {
        id: id,
        title: title,
        category: category,
        format: format,
        price: parsedPrice,
        additionalInfo: additional || "Standard Conference Inclusions",
    };

    productCatalog.push(newProduct);
    productForm.reset();
    renderCatalog(productCatalog);
    document.getElementById("catalogCounter").textContent =
        `${productCatalog.length} Items`;
});
function renderCatalog(items) {
    catalogContainer.innerHTML = "";

    if (items.length === 0) {
        catalogContainer.innerHTML = `
        <div class="col-12 text-center text-muted py-4">
            No matching passes or items found.
        </div>`;
        return;
    }

    items.forEach((item) => {
        const col = document.createElement("div");
        col.className = "col-md-6 col-lg-3";
        col.innerHTML = `
        <div class="card h-100 shadow-sm border-0">
            <div class="card-body d-flex flex-column">
                <div class="d-flex justify-content-between align-items-start mb-2">
                    <span class="badge bg-secondary">${item.category}</span>
                    <span class="badge bg-light text-dark border font-monospace">${item.id}</span>
                </div>
                <h6 class="card-title fw-bold mb-1">${item.title}</h6>
                <p class="text-muted small mb-2">${item.format}</p>
                <p class="card-text small text-secondary flex-grow-1">${item.additionalInfo}</p>
                <div class="d-flex justify-content-between align-items-center mt-3 pt-2 border-top">
                    <span class="h5 mb-0 text-primary fw-bold">$${item.price.toFixed(2)}</span>
                    <button class="btn btn-sm btn-outline-primary" onclick="addToCart('${item.id}')">
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    `;
        catalogContainer.appendChild(col);
    });
}
window.addToCart = function (productId) {
    const product = productCatalog.find((item) => item.id === productId);
    if (!product) return;

    const existingCartItem = shoppingCart.find((item) => item.id === productId);
    if (existingCartItem) {
        existingCartItem.quantity += 1;
    } else {
        shoppingCart.push({
            id: product.id,
            title: product.title,
            category: product.category,
            price: product.price,
            quantity: 1,
        });
    }
    updateCartUI();
};
window.removeFromCart = function (productId) {
    shoppingCart = shoppingCart.filter((item) => item.id !== productId);
    updateCartUI();
};

window.updateQuantity = function (productId, newQty) {
    const qty = parseInt(newQty, 10);
    const cartItem = shoppingCart.find((item) => item.id === productId);
    if (!cartItem) return;

    if (qty <= 0 || isNaN(qty)) {
        removeFromCart(productId);
    } else {
        cartItem.quantity = qty;
        updateCartUI();
    }
};

function updateCartUI() {
    cartTableBody.innerHTML = "";
    if (shoppingCart.length === 0) {
        cartTableBody.innerHTML = `
        <tr>
            <td colspan="7" class="text-center text-muted py-4">
                Your cart is empty. Add conference passes or add-ons above!
            </td>
        </tr>`;
        cartSubtotalEl.textContent = "$0.00";
        cartTaxEl.textContent = "$0.00";
        cartTotalEl.textContent = "$0.00";
        navCartCount.textContent = "0";
        checkoutBtn.disabled = true;
        cartJsonOutput.textContent = "[]";
        return;
    }

    let subtotal = 0;
    let totalItems = 0;
    shoppingCart.forEach((item) => {
        const itemSubtotal = item.price * item.quantity;
        subtotal += itemSubtotal;
        totalItems += item.quantity;
        const row = document.createElement("tr");
        row.innerHTML = `
        <td class="font-monospace fw-bold">${item.id}</td>
        <td>${item.title}</td>
        <td><span class="badge bg-secondary">${item.category}</span></td>
        <td>$${item.price.toFixed(2)}</td>
        <td>
            <input type="number" min="1" max="20" class="form-control form-control-sm text-center" 
                   value="${item.quantity}" onchange="updateQuantity('${item.id}', this.value)">
        </td>
        <td class="fw-bold">$${itemSubtotal.toFixed(2)}</td>
        <td class="text-center">
            <button class="btn btn-sm btn-outline-danger" onclick="removeFromCart('${item.id}')">Remove</button>
        </td>
    `;
        cartTableBody.appendChild(row);
    });

    const tax = subtotal * 0.0825;
    const grandTotal = subtotal + tax;
    cartSubtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    cartTaxEl.textContent = `$${tax.toFixed(2)}`;
    cartTotalEl.textContent = `$${grandTotal.toFixed(2)}`;
    navCartCount.textContent = totalItems.toString();
    checkoutBtn.disabled = false;
    cartJsonOutput.textContent = JSON.stringify(shoppingCart, null, 2);
}
document.getElementById("clearCartBtn").addEventListener("click", function () {
    shoppingCart = [];
    updateCartUI();
});
$(document).ready(function () {
    function filterCatalog() {
        const query = $("#catalogSearchInput").val().toLowerCase().trim();
        const selectedCategory = $("#catalogCategoryFilter").val();

        const filtered = productCatalog.filter((item) => {
            const matchesQuery =
                item.title.toLowerCase().includes(query) ||
                item.id.toLowerCase().includes(query) ||
                item.additionalInfo.toLowerCase().includes(query);
            const matchesCategory =
                selectedCategory === "ALL" || item.category === selectedCategory;
            return matchesQuery && matchesCategory;
        });
        renderCatalog(filtered);
    }
    $("#catalogSearchInput").on("input keyup", filterCatalog);
    $("#catalogCategoryFilter").on("change", filterCatalog);
    $("#checkoutBtn").on("click", function () {
        if (shoppingCart.length === 0) return;
        const payload = {
            orderId: "ORD-" + Date.now(),
            timestamp: new Date().toISOString(),
            itemCount: shoppingCart.reduce((acc, curr) => acc + curr.quantity, 0),
            items: shoppingCart,
            subtotal: parseFloat(cartSubtotalEl.textContent.replace("$", "")),
            totalDue: parseFloat(cartTotalEl.textContent.replace("$", "")),
        };
        const $btn = $(this);
        $btn.prop("disabled", true).text("Transporting Data via AJAX...");
        $.ajax({
            url: "https://jsonplaceholder.typicode.com/posts",
            type: "POST",
            contentType: "application/json; charset=UTF-8",
            data: JSON.stringify(payload),
            success: function (response) {
                $("#ajaxResponseAlert")
                    .removeClass("d-none alert-danger")
                    .addClass("alert-success").html(`
                    <strong>Registration Transport Successful! (HTTP 201 Created)</strong><br>
                    Cart payload transported to RESTful API.<br>
                    <small class="font-monospace">Transmitted Order ID: ${payload.orderId} | Server Record ID: ${response.id}</small>
                `);
                shoppingCart = [];
                updateCartUI();
                window.scrollTo({ top: 0, behavior: "smooth" });
            },
            error: function (xhr, status, error) {
                $("#ajaxResponseAlert")
                    .removeClass("d-none alert-success")
                    .addClass("alert-danger")
                    .html(`<strong>AJAX Transport Error:</strong> ${error || status}`);
            },
            complete: function () {
                $btn.prop("disabled", false).text("Submit Registration via AJAX");
            },
        });
    });
});
