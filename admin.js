
const complaintList = document.getElementById("complaintList");

async function loadComplaints() {

    try {
        const response = await fetch(
            "http://localhost:3000/api/complaints"
        );

        if (!response.ok) {
            throw new Error("Could not load complaints.");
        }

        const complaints = await response.json();

        // Update dashboard statistics
        document.getElementById("total").innerText =
            complaints.length;

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
                '<tr><td colspan="6" class="empty">No complaints submitted yet.</td></tr>';
            return;
        }

        complaints.forEach(complaint => {

            const row = document.createElement("tr");

            const values = [
    complaint.id,
    complaint.name,
    complaint.location,
    complaint.description,
    complaint.priority || "Medium"
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

            select.addEventListener("change", async function() {

                try {
                    const updateResponse = await fetch(
                        "http://localhost:3000/api/complaints/" + complaint.id,
                        {
                            method: "PATCH",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                status: select.value
                            })
                        }
                    );

                    const data = await updateResponse.json();

                    if (!updateResponse.ok) {
                        throw new Error(data.message || "Status update failed.");
                    }

                    updateStatusColor();
                    await loadComplaints();

                } catch (error) {
                    alert("Could not update complaint status.");
                    console.error(error);
                    await loadComplaints();
                }
            });

            statusCell.appendChild(select);
            row.appendChild(statusCell);

            complaintList.appendChild(row);
        });

    } catch (error) {
        console.error("Error loading complaints:", error);
        complaintList.innerHTML =
            '<tr><td colspan="6" class="empty">Unable to load complaints.</td></tr>';
    }
}

loadComplaints();
