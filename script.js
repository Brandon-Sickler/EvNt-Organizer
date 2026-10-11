let membersList = [
  {
    "id": 1728640001,
    "fullName": "Brandon Sickler",
    "email": "bms6598@psu.edu",
    "age": 36,
    "affiliation": "Penn State World Campus",
    "phone": "555-555-5555"
  },
  {
    "id": 1728640002,
    "fullName": "Antwan Blassingame",
    "email": "aab123@psu.edu",
    "age": 25,
    "affiliation": "EvNt Technical Committee",
    "phone": "555-555-5555"
  }
];

const signupForm = document.getElementById("signup-form");
const fullNameInput = document.getElementById("fullName");
const emailInput = document.getElementById("email");
const ageInput = document.getElementById("age");
const phoneInput = document.getElementById("phone");
const affiliationInput = document.getElementById("affiliation");
const editIndexInput = document.getElementById("editIndex");
const submitBtn = document.getElementById("submitBtn");
const cancelEditBtn = document.getElementById("cancelEditBtn");
const errorAlert = document.getElementById("errorAlert");
const membersTableBody = document.getElementById("membersTableBody");
const jsonOutput = document.getElementById("jsonOutput");

document.addEventListener("DOMContentLoaded", function () {
    renderMembers();  
});

signupForm.addEventListener("submit", function (e) {
    e.preventDefault();

    errorAlert.classList.add("d-none");
    errorAlert.innerHTML = "";

    const fullName = fullNameInput.value.trim();
    const email = emailInput.value.trim();
    const age = ageInput.value.trim();
    const affiliation = affiliationInput.value.trim();
    const phone = phoneInput.value.trim();
    const editIndex = parseInt(editIndexInput.value, 10);

    const errors = [];

    if (fullName.length < 2) {
        errors.push("Full Name is required and must contain atleast 2 characters.");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        errors.push("Please provide a valid email address (e.g. name@example.com).");
    }

    const parsedAge = parseInt(age, 10);
    if (isNaN(parsedAge) || parsedAge < 1 || parsedAge > 120) {
        errors.push("Age must be a valid number between 1 and 120.");
    }

    if (affiliation.length < 2) {
        errors.push("Address or Affiliation is required.");
    }

    if (phone.length > 0) {
        const phoneRegex = /^[\d\s\-\(\)\.+]{7,20}$/;
        if (!phoneRegex.test(phone)) {
            errors.push("Please provide a valid phone format or leave it blank.");
        }
    }

    if (errors.length > 0) {
        errorAlert.innerHTML = errors.map(err => `<div>&bull; ${err}</div>`).join("");
        errorAlert.classList.remove("d-none");
        return;
    }

    const memberData = {
        id: editIndex >= 0 ? membersList[editIndex].id : Date.now(),
        fullName: fullName,
        email: email,
        age: parsedAge,
        affiliation: affiliation,
        phone: phone || "N/A"
    };

    if (editIndex >= 0) {
        membersList[editIndex] = memberData;
        resetFormState();
    } else {
        membersList.push(memberData);
        resetFormState();
    }

    renderMembers();
});

function renderMembers() {
    membersTableBody.innerHTML = "";

    if (membersList.length === 0) {
        membersTableBody.innerHTML = `<tr><td colspan="6" class="text-center text muted py-3">No registered attendees found.</td></tr>`;
        jsonOutput.textContent = "[]";
        return;
    }

    membersList.forEach((member, index) => {
        const row = document.createElement("tr");

        row.innerHTML = ` <td>${member.fullName}</td>
            <td>${member.email}</td>
            <td>${member.age}</td>
            <td>${member.affiliation}</td>
            <td>${member.phone}</td>
            <td class="text-center"> 
                <button class="btn btn-sm btn-outline-primary me-1" onclick="editMember(${index})">Edit</button>
                <button class="btn btn-sm btn-outline-danger" onclick="deleteMember(${index})">Delete</button>
            </td>`;
            membersTableBody.appendChild(row);
    });

    jsonOutput.textContent = JSON.stringify(membersList, null, 2);
}

window.editMember = function (index) {
    const member = membersList[index];
    fullNameInput.value = member.fullName;
    emailInput.value = member.email;
    ageInput.value = member.age;
    affiliationInput.value = member.affiliation;
    phoneInput.value = member.phone === "N/A" ? "" : member.phone;

    editIndexInput.value = index;
    submitBtn.textContent = "Update Attendee";
    cancelEditBtn.classList.remove("d-none");
    errorAlert.classList.add("d-none");
    window.scrollTo({top: 0, behavior: "smooth"});
};

function resetFormState() {
    signupForm.reset();
    editIndexInput.value = "-1";
    submitBtn.textContent = "Register Attendee";
    cancelEditBtn.classList.add("d-none");
    errorAlert.classList.add("d-none");
}

cancelEditBtn.addEventListener("click", resetFormState);

window.deleteMember = function (index) {
    membersList.splice(index, 1);
    renderMembers();
};



