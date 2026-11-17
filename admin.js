
const complaintList = document.getElementById("complaintList");

function loadComplaints() {

    let complaints =
        JSON.parse(localStorage.getItem("complaints")) || [];

    // Update dashboard statistics
    document.getElementById("total").innerText = complaints.length;

    document.getElementById("pending").innerText =
        complaints.filter(c => c.status === "Pending").length;

    document.getElementById("progress").innerText =
        complaints.filter(c => c.status === "In Progress").length;

    document.getElementById("resolved").innerText =
        complaints.filter(c => c.status === "Resolved").length;

    // Display all complaints
    complaintList.innerHTML = "";

    if (complaints.length === 0) {
        complaintList.innerHTML =
            '<tr><td colspan="5" class="empty">No complaints submitted yet.</td></tr>';
        return;
    }

    complaints.forEach(complaint => {

        const row = document.createElement("tr");

        const values = [
            complaint.id,
            complaint.name,
            complaint.location,
            complaint.description
        ];

        values.forEach(value => {
            const cell = document.createElement("td");
            cell.textContent = value;
            row.appendChild(cell);
        });

        const statusCell = document.createElement("td");
        const select = document.createElement("select");

        ["Pending", "In Progress", "Resolved"].forEach(status => {
            const option = document.createElement("option");
            option.value = status;
            option.textContent = status;

            if (complaint.status === status) {
                option.selected = true;
            }

            select.appendChild(option);
        });

        select.addEventListener("change", function() {

            let savedComplaints =
                JSON.parse(localStorage.getItem("complaints")) || [];

            const index = savedComplaints.findIndex(
                c => c.id === complaint.id
            );

            if (index !== -1) {
                savedComplaints[index].status = select.value;

                localStorage.setItem(
                    "complaints",
                    JSON.stringify(savedComplaints)
                );

                loadComplaints();
            }
        });

        function updateStatusColor() {
    select.className = "";

    if (select.value === "Pending") {
        select.classList.add("status-pending");
    } else if (select.value === "In Progress") {
        select.classList.add("status-progress");
    } else {
        select.classList.add("status-resolved");
    }
}

updateStatusColor();

select.addEventListener("change", updateStatusColor);

statusCell.appendChild(select);
        row.appendChild(statusCell);

        complaintList.appendChild(row);
    });
}

loadComplaints();
