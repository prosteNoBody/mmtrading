const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OfferScheme = new Schema({
    offer_id:String,
    user_id: String,
    items: [Number],
    price: Number,
    link: String,
    status: Number,
});

const Offer = mongoose.model('offers',OfferScheme);

module.exports = Offer;