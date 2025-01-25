var fs = require('fs');
var roomOptions = JSON.parse(fs.readFileSync('./data/roomOptions.json', 'utf8'));

/* GET rooms view */
const rooms = (req, res) => {
    // Added currentPage variable for assigning "selected" in headers.hbs
    res.render('rooms', {title: 'Travlr Getaways', roomOptions, currentPage: 'rooms'});
};

module.exports = {
    rooms
};