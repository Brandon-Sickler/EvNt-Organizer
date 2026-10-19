let sessionsList = [
    {
        id: "EVNT-101",
        title: "Modern Cloud Architecture & Microservices",
        category: "Technical Breakout",
        format: "In-Person",
        price: 149.99,
        additionalInfo: "Room 302B - Dr. Jane Smith"
    },
    {
        id: "EVNT-102",
        title: "AI & Automated Development Workflows",
        category: "Keynote",
        format: "Hybrid",
        price: 0.00,
        additionalInfo: "Main Auditorium - Live Streamed"
    },
    {
        id: "EVNT-103",
        title: "Hands-On React Native & Offline Sync Workshop",
        category: "Workshop",
        format: "In-Person",
        price: 89.99,
        additionalInfo: "Lab Hall C - Laptops Required"
    }
];


const sessionForm = document.getElementById("sessionForm");
const sessionIdInput = document.getElementById("sessionId");
const sessionTitleInput = document.getElementById("sessionTitle");
const sessionCategoryInput = document.getElementById("sessionCategory");
const sessionFormatInput = document.getElementById("sessionFormat");
const sessionPriceInput = document.getElementById("sessionPrice");
const sessionAdditionalInput = document.getElementById("sessionAdditional");
const editSessionIndexInput = document.getElementById("editSessionIndex");
const saveSessionBtn = document.getElementById("saveSessionBtn");
const cancelSessionEditBtn = document.getElementById("cancelSessionEditBtn");
const sessionErrorAlert = document.getElementById("sessionErrorAlert");
const sessionsTableBody = document.getElementById("sessionsTableBody");
const sessionsJsonOutput = document.getElementById("sessionsJsonOutput");


document.addEventListener("DOMContentLoaded", function () {
    renderSessions(sessionsList);
});


sessionForm.addEventListener("submit", function (e) {
    e.preventDefault();

    sessionErrorAlert.classList.add("d-none");
    sessionErrorAlert.innerHTML = "";

    const id = sessionIdInput.value.trim();
    const title = sessionTitleInput.value.trim();
    const category = sessionCategoryInput.value.trim();
    const format = sessionFormatInput.value.trim();
    const price = sessionPriceInput.value.trim();
    const additionalInfo = sessionAdditionalInput.value.trim();
    const editIndex = parseInt(editSessionIndexInput.value, 10);

    const errors = [];

   
    if (id.length < 3) {
        errors.push("Session ID is required and must be at least 3 characters (e.g. EVNT-104).");
    }

    if (title.length < 5) {
        errors.push("Session Title is required and must be at least 5 characters.");
    }

    if (!category) {
        errors.push("Please select a Category / Track.");
    }

    if (!format) {
        errors.push("Please select a Session Format.");
    }

    const parsedPrice = parseFloat(price);
    if (price === "" || isNaN(parsedPrice) || parsedPrice < 0) {
        errors.push("Registration Fee must be a valid non-negative number (enter 0 for free).");
    }

    
    if (errors.length > 0) {
        sessionErrorAlert.innerHTML = errors.map(err => `<div>&bull; ${err}</div>`).join("");
        sessionErrorAlert.classList.remove("d-none");
        return;
    }

    const sessionData = {
        id: id,
        title: title,
        category: category,
        format: format,
        price: parsedPrice,
        additionalInfo: additionalInfo || "General Admission"
    };

    if (editIndex >= 0) {
        sessionsList[editIndex] = sessionData;
    } else {
        sessionsList.push(sessionData);
    }

    resetSessionForm();
    renderSessions(sessionsList);
});


function renderSessions(data) {
    sessionsTableBody.innerHTML = "";

    if (data.length === 0) {
        sessionsTableBody.innerHTML = `<tr><td colspan="7" class="text-center text-muted py-3">No matching conference sessions found.</td></tr>`;
        sessionsJsonOutput.textContent = "[]";
        return;
    }

    data.forEach((item, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td class="fw-bold">${item.id}</td>
            <td>${item.title}</td>
            <td><span class="badge bg-secondary">${item.category}</span></td>
            <td>${item.format}</td>
            <td>$${item.price.toFixed(2)}</td>
            <td>${item.additionalInfo}</td>
            <td class="text-center">
                <button class="btn btn-sm btn-outline-primary me-1" onclick="editSession(${index})">Edit</button>
                <button class="btn btn-sm btn-outline-danger" onclick="deleteSession(${index})">Delete</button>
            </td>
        `;
        sessionsTableBody.appendChild(row);
    });

    sessionsJsonOutput.textContent = JSON.stringify(sessionsList, null, 2);
}
window.editSession = function (index) {
    const item = sessionsList[index];
    $(sessionIdInput).val(item.id);
    $(sessionTitleInput).val(item.title);
    $(sessionCategoryInput).val(item.category);
    $(sessionFormatInput).val(item.format);
    $(sessionPriceInput).val(item.price);
    $(sessionAdditionalInput).val(item.additionalInfo === "General Admission" ? "" : item.additionalInfo);

    $(editSessionIndexInput).val(index);
    $(saveSessionBtn).text("Update Session");
    $(cancelSessionEditBtn).removeClass("d-none");
    $(sessionErrorAlert).addClass("d-none");
    window.scrollTo({ top: 0, behavior: "smooth" });
};

function resetSessionForm() {
    $(sessionForm).trigger("reset");
    $(editSessionIndexInput).val("-1");
    $(saveSessionBtn).text("Add Session");
    $(cancelSessionEditBtn).addClass("d-none");
    $(sessionErrorAlert).addClass("d-none");
}

cancelSessionEditBtn.addEventListener("click", resetSessionForm);

window.deleteSession = function (index) {
    sessionsList.splice(index, 1);
    filterSessions();
};

function filterSessions() {
    const searchInput = $("#searchInput").val().toLowerCase().trim();
    const selectedCategory = $("#filterCategory").val();
    const filteredSessions = sessionsList.filter(session => {
        const matchesSearch = session.title.toLowerCase().includes(searchInput) || 
                              session.id.toLowerCase().includes(searchInput);
        const matchesCategory = selectedCategory === "" || 
                                session.category === selectedCategory || 
                                selectedCategory === "ALL";
        return matchesSearch && matchesCategory;
    });
    renderSessions(filteredSessions);
}

$("#searchInput").on("input", filterSessions);
$("#filterCategory").on("change", filterSessions);