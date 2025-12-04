const mongoose = require('mongoose');

const Schema = new mongoose.Schema(
    {
        params: { type: String, trim: true }
    },
    {
        timestamps: true,
        toJSON: {
            virtuals: true
        }
    }
);

const Model = mongoose.model('base', Schema);
module.exports = Model;
