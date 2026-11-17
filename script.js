
const form = document.getElementById("complaintForm");

form.addEventListener("submit", function(event) {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const location = document.getElementById("location").value;
    const description = document.getElementById("description").value;

    const complaintID = "W360" + Math.floor(1000 + Math.random() * 9000);

    const complaint = {
        id: complaintID,
        name: name,
        location: location,
        description: description,
        status: "Pending"
    };

    let complaints = JSON.parse(localStorage.getItem("complaints")) || [];

    complaints.push(complaint);

    localStorage.setItem("complaints", JSON.stringify(complaints));

    document.getElementById("message").innerText =
        "Complaint submitted successfully! Your ID is: " + complaintID;

    form.reset();
});
