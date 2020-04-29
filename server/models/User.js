const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserScheme = new Schema({
    steamid:String,
    name:String,
    avatar:String,
    credit:Number,
    tradeUrl:String,
});

const User = mongoose.model('users',UserScheme);

module.exports = User;