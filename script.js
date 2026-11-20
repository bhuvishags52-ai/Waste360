
const form = document.getElementById("complaintForm");

form.addEventListener("submit", async function(event) {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const location = document.getElementById("location").value;
    const description = document.getElementById("description").value;
    const priority = document.getElementById("priority").value;

    const message = document.getElementById("message");

    try {
        const response = await fetch("http://localhost:3000/api/complaints", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: name,
                location: location,
                description: description,
                priority: priority
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Submission failed.");
        }

        message.innerText =
            "Complaint submitted successfully! Your ID is: " +
            data.complaint.id;

        form.reset();

    } catch (error) {
        message.innerText =
            "Error submitting complaint. Please try again.";

        console.error(error);
    }
});
