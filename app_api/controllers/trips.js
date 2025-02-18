const mongoose = require('mongoose');
const Trip = require('../models/travlr'); // Register model
const Model = mongoose.model('trips');
const User = require('../models/user');

const getUser = async (req, res, callback) => {
    console.log('in #getUser');
    console.log('Auth User:', req.auth); // Debugging log

    if (req.auth && req.auth.email) { 
        try {
            const user = await User.findOne({ email: req.auth.email }).exec();

            if (!user) { 
                console.log("Email not found:", req.auth.email);
                return res.status(404).json({ "message": "Email not found" });
            }

            console.log("User found:", user.email);
            callback(user); // Pass only the user object

        } catch (err) {
            console.log("Database error:", err);
            return res.status(500).json(err);
        }
    } else {
        console.log("Invalid request, missing auth:", req.auth);
        return res.status(404).json({ "message": "User was not found" });
    }
};



const tripsList = async(req, res) => {
    try {
        const q = await Model.find({}).exec();
        console.log(q);

        if (!q || q.length === 0) {
            return res
                .status(404)
                .json({ message: "No trips found" });
        } 
        return res
            .status(200)
            .json(q);
    } catch (err) {
        return res
            .status(500)
            .json(err);
    }
};

const tripsFindByCode = async(req, res) => {
    try {
        const q = await Model.findOne({ 'code': req.params.tripCode }).exec();
        console.log(q);

        if (!q) {
            return res
                .status(404)
                .json({ message: "Trip not found" });
        } 
        return res
            .status(200)
            .json(q);
    } catch (err) {
        return res
            .status(500)
            .json(err);
    }
};

// POST: /trips - Adds a new Trip
const tripsAddTrip = async (req, res) => {
    getUser(req, res, async (user) => { 
        try {
            const trip = await Trip.create({
                code: req.body.code,
                name: req.body.name,
                length: req.body.length,
                start: req.body.start,
                resort: req.body.resort,
                perPerson: req.body.perPerson,
                image: req.body.image,
                description: req.body.description
            });
            return res.status(201).json(trip);
        } catch (err) {
            return res.status(400).json(err);
        }
    });
};


// PUT: /trips/:tripCode - Updates an existing Trip
const tripsUpdateTrip = async (req, res) => {
    getUser(req, res, async (user) => {  
        if (!user) {
            console.log("User lookup failed in getUser.");
            return res.status(404).json({ message: "User not found" });
        }

        console.log("Authenticated User:", user.email);

        try {
            const trip = await Trip.findOneAndUpdate(
                { 'code': req.params.tripCode }, 
                req.body, 
                { new: true }
            );

            if (!trip) {
                console.log("Trip not found with code:", req.params.tripCode);
                return res.status(404).json({ message: "Trip not found with code " + req.params.tripCode });
            }

            console.log("Returning Updated Trip");
            return res.json(trip);

        } catch (err) {
            console.error("Error updating trip:", err);
            return res.status(500).json({ message: "Server error", error: err });
        }
    });
};



module.exports = {
    tripsList,
    tripsFindByCode,
    tripsAddTrip,
    tripsUpdateTrip
};
