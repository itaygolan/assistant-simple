const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const mapSchema = new mongoose.Schema({
    name: String
});

const map = new mongoose.model('Location', mapSchema);
export default map;

