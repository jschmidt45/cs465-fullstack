mongoose = require('mongoose');
const Trip = require('../models/travlr'); // Register model
const Model = mongoose.model('trips');

const tripsList = async(req, res) => {
    const q = await Model
    .find({})
    .exec();

    console.log(q);

    if(!q)
    {
        return res
            .status(404)
            .json(err);
    } else {
        return res
            .status(200)
            .json(q);
    }
};

const tripsFindByCode = async(req, res) => {
    const q = await Model
    .find({'code' : req.params.tripCode})
    .exec();

    console.log(q);

    if(!q)
    {
        return res
            .status(404)
            .json(err);
    } else {
        return res
            .status(200)
            .json(q);
    }
};

// POST: /trips - Adds a new Trip
// Regardless of outcome, response must include HTML status code
// and JSON message to the requesting client
const tripsAddTrip = async (req, res) => {
    const newTrip = new Trip({
        code: req.body.code,
        name: req.body.name,
        length: req.body.length,
        start: req.body.start,
        resort: req.body.resort,
        perPerson: req.body.perPerson,
        image: req.body.image,
        description: req.body.description
    });

    const q = await newTrip.save();

    if (!q) {
        // Database returned no data
        return res
            .status(400)
            .json(err);
    } else {
        // Return new trip
        return res
            .status(201)
            .json(q);
    }
};

// Uncomment the following line to show results of operation
// on the console
// console.log(q);

// PUT: /trips/:tripCode - Updates an existing Trip
// Regardless of outcome, response must include an HTML status code
// and a JSON message to the requesting client
const tripsUpdateTrip = async (req, res) => {
    // Uncomment for debugging
    console.log(req.params);
    console.log(req.body);

    try {
        const q = await Model.findOneAndUpdate(
            { code: req.params.tripCode },  // ✅ Fixed quotes
            {
                code: req.body.code,
                name: req.body.name,
                length: req.body.length,
                start: req.body.start,
                resort: req.body.resort,
                perPerson: req.body.perPerson,
                image: req.body.image,
                description: req.body.description
            },
            { new: true } // ✅ Ensures the updated document is returned
        ).exec();

        if (!q) {
            // Database returned no data
            return res.status(404).json({ error: "Trip not found" }); // ✅ More specific error message
        }

        // Return the updated trip
        return res.status(200).json(q); // ✅ Changed status code to 200 (OK)
    
    } catch (err) {
        return res.status(500).json({ error: err.message }); // ✅ Catch any database errors
    }

    // Uncomment the following line to show results of the operation
    // console.log(q);
};

module.exports = {
    tripsList,
    tripsFindByCode,
    tripsAddTrip,
    tripsUpdateTrip
};

