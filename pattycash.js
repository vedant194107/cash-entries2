document.addEventListener("DOMContentLoaded", function () {

    const STORAGE_KEY = "pettyCashEntries_v1";

    const addBtn = document.querySelector(".btn-add");
    const drawer = document.getElementById("drawer");
    const overlay = document.getElementById("overlay");
    const submitBtn = document.getElementById("submitBtn");
    const tableBody = document.getElementById("entryTableBody");

    let closingBalance = 0;
    let editId = null; // 🔥 for edit mode

    // HIDE POPUP INITIALLY
    drawer.classList.remove("open");
    overlay.style.display = "none";

    // OPEN
    addBtn.onclick = () => {
        drawer.classList.add("open");
        overlay.style.display = "block";
    };

    // CLOSE
    window.closeDrawer = () => {
        drawer.classList.remove("open");
        overlay.style.display = "none";

        editId = null; // reset edit
        submitBtn.innerText = "Create";
    };

    overlay.onclick = () => closeDrawer();

    loadEntries();

    // SUBMIT (CREATE + UPDATE)
    submitBtn.onclick = function () {

        const amount = parseFloat(
            document.getElementById("amount").value.replace(/[^0-9.]/g, "")
        );

        const type = document.getElementById("type").value;
        const remarks = document.getElementById("remarks").value.trim();
        const date = document.getElementById("date").value;

        if (!amount || !type || !remarks || !date) {
            alert("Please fill all required fields");
            return;
        }

        let entries = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

        if (editId) {
            // 🔥 UPDATE
            entries = entries.map(e => {
                if (e.id === editId) {
                    return { ...e, amount, type, remarks, date };
                }
                return e;
            });

            editId = null;
            submitBtn.innerText = "Create";

        } else {
            // 🔥 CREATE
            const entry = {
                id: Date.now(),
                amount,
                type,
                remarks,
                date
            };

            entries.push(entry);
        }

        localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));

        loadEntries();
        closeDrawer();
        clearForm();
    };

    // ADD ROW
    function addRow(entry, balance) {

        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${entry.remarks}</td>
            <td>${entry.date}</td>
            <td>${entry.type}</td>
            <td>${entry.type === "Debit" ? "₹" + entry.amount : "-"}</td>
            <td>${entry.type === "Credit" ? "₹" + entry.amount : "-"}</td>
            <td>₹${balance.toFixed(2)}</td>
            <td>
                <button class="edit-btn" data-id="${entry.id}">Edit</button>
                <button class="delete-btn" data-id="${entry.id}">Delete</button>
            </td>
        `;

        tableBody.appendChild(tr);
    }

    // LOAD DATA
    function loadEntries() {

        const entries = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

        closingBalance = 0;
        tableBody.innerHTML = "";

        entries.forEach(entry => {

            if (entry.type === "Credit") {
                closingBalance += entry.amount;
            } else {
                closingBalance -= entry.amount;
            }

            addRow(entry, closingBalance);
        });
    }

    // DELETE + EDIT
    tableBody.addEventListener("click", function (e) {

        const id = Number(e.target.getAttribute("data-id"));

        let entries = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

        // DELETE
        if (e.target.classList.contains("delete-btn")) {

            entries = entries.filter(entry => entry.id !== id);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));

            loadEntries();
        }

        // EDIT
        if (e.target.classList.contains("edit-btn")) {

            const entry = entries.find(e => e.id === id);
            if (!entry) return;

            // fill form
            document.getElementById("remarks").value = entry.remarks;
            document.getElementById("amount").value = entry.amount;
            document.getElementById("type").value = entry.type;
            document.getElementById("date").value = entry.date;

            editId = id;

            submitBtn.innerText = "Update";

            // open popup
            drawer.classList.add("open");
            overlay.style.display = "block";
        }

    });

    function clearForm() {
        document.getElementById("amount").value = "";
        document.getElementById("type").value = "";
        document.getElementById("remarks").value = "";
        document.getElementById("date").value = "";
    }

});
