
const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "complaints.json");

function getComplaints() {
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, "[]");
    }

    const data = fs.readFileSync(filePath, "utf8");
    return JSON.parse(data);
}

function saveComplaints(complaints) {
    fs.writeFileSync(
        filePath,
        JSON.stringify(complaints, null, 2)
    );
}

module.exports = {
    getComplaints,
    saveComplaints
};
