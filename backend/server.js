
const express = require("express");
const cors = require("cors");
const path = require("path");

const { getComplaints, saveComplaints } = require("./database");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Serve frontend files
app.use(express.static(path.join(__dirname, "..")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "index.html"));
});

// Get all complaints
app.get("/api/complaints", (req, res) => {
    res.json(getComplaints());
});

// Submit a new complaint
app.post("/api/complaints", (req, res) => {
    const { name, location, description, priority } = req.body;
    console.log("Received priority:", priority);

    if (!name || !location || !description) {
        return res.status(400).json({
            message: "Please fill in all fields."
        });
    }

    const complaints = getComplaints();

    const complaint = {
        id: "W360" + Math.floor(1000 + Math.random() * 9000),
        name,
        location,
        description,
        status: "Pending",
        priority: ["Low", "Medium", "High"].includes(priority)
    ? priority
    : "Medium",
        createdAt: new Date().toISOString()
    };

    complaints.push(complaint);
    saveComplaints(complaints);

    res.status(201).json({
        message: "Complaint submitted successfully!",
        complaint
    });
});

// Update complaint status
app.patch("/api/complaints/:id", (req, res) => {
    const complaints = getComplaints();

    const complaint = complaints.find(
        item => item.id === req.params.id
    );

    if (!complaint) {
        return res.status(404).json({
            message: "Complaint not found."
        });
    }

    const { status } = req.body;
    const allowedStatuses = ["Pending", "In Progress", "Resolved"];

    if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
            message: "Invalid complaint status."
        });
    }

    complaint.status = status;
    saveComplaints(complaints);

    res.json({
        message: "Status updated successfully!",
        complaint
    });
});

app.listen(PORT, () => {
    console.log(`WASTE360 backend running at http://localhost:${PORT}`);
});
