document.addEventListener("DOMContentLoaded", () => {

    const addBtn = document.querySelector(".btn-add");
    const drawer = document.getElementById("drawer");
    const overlay = document.getElementById("overlay");
    const closeBtn = document.getElementById("closeDrawer");
    const cancelBtn = document.getElementById("cancelBtn");
    const submitBtn = document.getElementById("submitBtn");
    const tableBody = document.getElementById("entryTableBody");

    // ---------- OPEN ----------
    addBtn.onclick = () => {
        drawer.classList.add("open");
        overlay.style.display = "block";
    };

    // ---------- CLOSE ----------
    function closeDrawer() {
        drawer.classList.remove("open");
        overlay.style.display = "none";
    }

    overlay.onclick = closeDrawer;
    closeBtn.onclick = closeDrawer;
    cancelBtn.onclick = closeDrawer;

    // ---------- LOAD SAVED ----------
    loadContacts();

    // ---------- CREATE ----------
    submitBtn.onclick = () => {

        const name = document.getElementById("name").value.trim();
        const purpose = document.getElementById("purpose").value.trim();
        const group = document.getElementById("group").value;
        const primary = document.getElementById("primaryContact").value.trim();
        const secondary = document.getElementById("secondaryContact").value.trim();

        if (!name || !primary) {
            alert("Name and Primary Contact are required");
            return;
        }

        const contact = {
            id: Date.now(),
            name,
            purpose,
            group,
            primary,
            secondary,
            createdAt: new Date().toLocaleDateString()
        };

        const contacts = JSON.parse(localStorage.getItem("contacts")) || [];
        contacts.push(contact);
        localStorage.setItem("contacts", JSON.stringify(contacts));

        addRow(contact);
        clearForm();
        closeDrawer();
    };

    // ---------- FUNCTIONS ----------
    function addRow(c) {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${c.id}</td>
            <td>${c.name}</td>
            <td>${c.purpose || "-"}</td>
            <td>${c.group || "-"}</td>
            <td>${c.primary}</td>
            <td>${c.secondary || "-"}</td>
            <td>${c.createdAt}</td>
        `;
        tableBody.prepend(tr);
    }

    function loadContacts() {
        const contacts = JSON.parse(localStorage.getItem("contacts")) || [];
        contacts.forEach(addRow);
    }

    function clearForm() {
        document.querySelectorAll(".drawer-body input, .drawer-body textarea, .drawer-body select")
            .forEach(el => el.value = "");
    }

});
