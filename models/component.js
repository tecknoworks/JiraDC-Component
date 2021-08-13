const mongoose = require('mongoose')

const model = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    user_id: {
        type: String,
        required: true
    },
    project_id: {
        type: String,
        required: true
    }
});

module.exports = new mongoose.model("Component", model)