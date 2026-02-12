document.addEventListener("DOMContentLoaded", function () {

    const customerSelect = document.getElementById("customerSelect");
    const fromDateInput = document.getElementById("fromDate");
    const toDateInput = document.getElementById("toDate");
    const searchBtn = document.querySelector(".search");
    const tableBody = document.getElementById("ledgerTableBody");

    loadCustomers();

    function loadCustomers() {
        const entries = JSON.parse(localStorage.getItem("cashEntries")) || [];
        const unique = new Set();

        customerSelect.innerHTML = `<option value="">Select Customer</option>`;

        entries.forEach(e => {
            if (!e.contactName) return;
            const name = e.contactName.trim();
            if (!unique.has(name.toLowerCase())) {
                unique.add(name.toLowerCase());
                const opt = document.createElement("option");
                opt.value = name;
                opt.textContent = name;
                customerSelect.appendChild(opt);
            }
        });
    }

    searchBtn.addEventListener("click", function () {
        if (!customerSelect.value) {
            alert("Please select customer");
            return;
        }
        loadLedger(customerSelect.value, fromDateInput.value, toDateInput.value);
    });

    function loadLedger(customerName, fromDate, toDate) {
        tableBody.innerHTML = "";
        let balance = 0;

        const entries = JSON.parse(localStorage.getItem("cashEntries")) || [];

        let filtered = entries.filter(e =>
            e.contactName &&
            e.contactName.trim().toLowerCase() === customerName.trim().toLowerCase()
        );

        if (fromDate) filtered = filtered.filter(e => !e.date || e.date >= fromDate);
        if (toDate) filtered = filtered.filter(e => !e.date || e.date <= toDate);

        if (!filtered.length) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="5" style="text-align:center;">No records found</td>
                </tr>`;
            return;
        }

        filtered.forEach(e => {
            if (e.type === "Debit") balance -= e.amount;
            else balance += e.amount;

            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${e.date ? formatDate(e.date) : "-"}</td>
                <td>${e.subType}</td>
                <td>${e.type === "Debit" ? "₹" + e.amount : "-"}</td>
                <td>${e.type === "Credit" ? "₹" + e.amount : "-"}</td>
                <td>₹${balance.toFixed(2)}</td>
            `;
            tableBody.appendChild(tr);
        });
    }

    function formatDate(dateStr) {
        const [y, m, d] = dateStr.split("-");
        return `${d}-${m}-${y}`;
    }
});
