document.addEventListener("DOMContentLoaded", function () {

    const STORAGE_KEY = "pettyCashEntries_v1";

    const addBtn = document.querySelector(".btn-add");
    const drawer = document.getElementById("drawer");
    const overlay = document.getElementById("overlay");
    const submitBtn = document.getElementById("submitBtn");
    const tableBody = document.getElementById("entryTableBody");

    let closingBalance = 0;

    // 🔹 Ensure drawer hidden on page load
    drawer.classList.remove("open");
    overlay.style.display = "none";

    // 🔹 OPEN POPUP
    addBtn.addEventListener("click", function () {
        drawer.classList.add("open");
        overlay.style.display = "block";
    });

    // 🔹 CLOSE POPUP
    window.closeDrawer = function () {
        drawer.classList.remove("open");
        overlay.style.display = "none";
    };

    // 🔹 Close when clicking overlay
    overlay.addEventListener("click", function () {
        closeDrawer();
    });

    loadEntries();

    // 🔹 CREATE ENTRY
    submitBtn.addEventListener("click", function () {

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

        const entry = {
            id: Date.now(),
            amount,
            type,
            remarks,
            date
        };

        const entries = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
        entries.push(entry);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));

        loadEntries();
        closeDrawer();
        clearForm();
    });

    // 🔹 ADD ROW
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
                <button class="delete-btn" data-id="${entry.id}">
                    Delete
                </button>
            </td>
        `;

        tableBody.appendChild(tr);
    }

    // 🔹 LOAD DATA
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

    // 🔹 DELETE (Event Delegation - Cleaner)
    tableBody.addEventListener("click", function (e) {

        if (e.target.classList.contains("delete-btn")) {

            const id = Number(e.target.getAttribute("data-id"));

            let entries = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

            entries = entries.filter(entry => entry.id !== id);

            localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));

            loadEntries();
        }
    });

    function clearForm() {
        document.getElementById("amount").value = "";
        document.getElementById("type").value = "";
        document.getElementById("remarks").value = "";
        document.getElementById("date").value = "";
    }

});
