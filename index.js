document.addEventListener("DOMContentLoaded", function () {

    if (!localStorage.getItem("cashEntries_v3")) {
        const oldEntries = JSON.parse(localStorage.getItem("cashEntries")) || [];

        // 🔥 AUTO FIX OLD ENTRIES (ADD DATE)
        const fixedEntries = oldEntries.map(e => ({
            ...e,
            date: e.date || new Date().toISOString().split("T")[0]
        }));

        localStorage.setItem("cashEntries", JSON.stringify(fixedEntries));
        localStorage.setItem("cashEntries_v3", "true");
    }

    const addBtn = document.querySelector(".btn-add");
    const drawer = document.getElementById("drawer");
    const overlay = document.getElementById("overlay");
    const submitBtn = document.getElementById("submitBtn");
    const tableBody = document.getElementById("entryTableBody");

    let closingBalance = 0;

    addBtn.onclick = () => {
        drawer.classList.add("open");
        overlay.style.display = "block";
    };

    window.closeDrawer = () => {
        drawer.classList.remove("open");
        overlay.style.display = "none";
    };

    loadContactsForEntry();
    loadEntries();

    submitBtn.onclick = function () {

        const contactName = document.getElementById("contactName").value.trim();
        const amount = parseFloat(
            document.getElementById("amount").value.replace(/[^0-9.]/g, "")
        );
        const type = document.getElementById("type").value;
        const subType = document.getElementById("subType").value;
        const remarks = document.getElementById("remarks").value;

        if (!contactName || !amount || !type || !subType || !remarks) {
            alert("Please fill all required fields");
            return;
        }

        if (type === "Credit") closingBalance += amount;
        else closingBalance -= amount;

        const entry = {
            contactName,
            amount,
            type,
            subType,
            remarks,
            date: new Date().toISOString().split("T")[0] // ✅ DATE
        };

        const entries = JSON.parse(localStorage.getItem("cashEntries")) || [];
        entries.push(entry);
        localStorage.setItem("cashEntries", JSON.stringify(entries));

        addRow(entry, closingBalance);
        closeDrawer();
        clearForm();
    };

    function loadContactsForEntry() {
        const select = document.getElementById("contactName");
        select.innerHTML = `<option value="">Select Contact</option>`;

        const contacts = JSON.parse(localStorage.getItem("contacts")) || [];
        contacts.forEach(c => {
            const opt = document.createElement("option");
            opt.value = c.name;
            opt.textContent = c.name;
            select.appendChild(opt);
        });
    }

    function addRow(entry, balance) {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${entry.contactName}</td>
            <td>${entry.type}</td>
            <td>${entry.type === "Debit" ? "₹" + entry.amount : "-"}</td>
            <td>${entry.type === "Credit" ? "₹" + entry.amount : "-"}</td>
            <td>₹${balance.toFixed(2)}</td>
            <td>${entry.subType}</td>
        `;
        tableBody.prepend(tr);
    }

    function loadEntries() {
        const entries = JSON.parse(localStorage.getItem("cashEntries")) || [];
        closingBalance = 0;
        tableBody.innerHTML = "";

        entries.forEach(e => {
            if (e.type === "Credit") closingBalance += e.amount;
            else closingBalance -= e.amount;
            addRow(e, closingBalance);
        });
    }

    function clearForm() {
        document.getElementById("contactName").value = "";
        document.getElementById("amount").value = "";
        document.getElementById("type").value = "";
        document.getElementById("subType").value = "";
        document.getElementById("remarks").value = "";
    }
});
