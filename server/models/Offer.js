const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OfferScheme = new Schema({
    id: String,
    trade_id:String,
    user_id: String,
    buyer_id: String,
    items: [String],
    price: Number,
    date: String,
    status: Number,
});

const Offer = mongoose.model('offers',OfferScheme);

module.exports = Offer;