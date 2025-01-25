var fs = require('fs');
var trips = JSON.parse(fs.readFileSync('./data/trips.json', 'utf8'));

/* GET travel view */
const travel = (req, res) => {
    // Added currentPage variable for assigning "selected" in headers.hbs
    res.render('travel', {title: 'Travlr Getaways', trips, currentPage: 'travel'});
};

module.exports = {
    travel
};