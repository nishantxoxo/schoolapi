const db = require("../config/db");
const getDistance = require("../utils/dist");


exports.addSchool = (req, res) => {
    const { name, address, latitude, longitude } = req.body;


    if (!name || !address || latitude == null || longitude == null) {
        return res.status(400).json({ message: "All fields are required" });
    }

    if (typeof latitude !== "number" || typeof longitude !== "number") {
        return res.status(400).json({ message: "Latitude & Longitude must be numbers" });
    }

    const query = "INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)";

    db.query(query, [name, address, latitude, longitude], (err, result) => {
        if (err) return res.status(500).json(err);

        res.status(201).json({
            message: "School added successfully",
            id: result.insertId
        });
    });
};

exports.listSchools = (req, res) => {
    const { latitude, longitude } = req.query;

    if (!latitude || !longitude) {
        return res.status(400).json({ message: "User latitude & longitude required" });
    }

    const userLat = parseFloat(latitude);
    const userLon = parseFloat(longitude);

    db.query("SELECT * FROM schools", (err, results) => {
        if (err) return res.status(500).json(err);

        const schoolsWithDistance = results.map((school) => {
            const distanceInKM = getDistance(
                userLat,
                userLon,
                school.latitude,
                school.longitude
            );

            return { ...school, distanceInKM };
        });

        schoolsWithDistance.sort((a, b) => a.distanceInKM - b.distanceInKM);

        res.json(schoolsWithDistance);
    });
};