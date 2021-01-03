const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OfferScheme = new Schema({
    offer_id:String,
    user_id: String,
    items: [String],
    price: Number,
    time: String,
    link: String,
    status: Number,
});

const Offer = mongoose.model('offers',OfferScheme);

module.exports = Offer;