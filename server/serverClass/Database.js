const mongoose = require("mongoose");
const User = require('../models/User');

const STEAM_TRADE_LINK = "https://steamcommunity.com/tradeoffer/new/";
const STEAM_LINK_PARAM_PARTNER = "partner=";
const STEAM_LINK_PARAM_TOKEN = "token=";

class Config {
    /**
     * @param {{mongoUrl}} config
     */
    constructor(config) {
        this.dbUrl = config.mongoUrl;
    }
}

class Database{
    constructor(config){
        this.config = new Config(config);
        mongoose.connect(this.config.dbUrl,{useUnifiedTopology: true,useNewUrlParser: true, useFindAndModify: false})
        .then(()=>{
            console.log("Successfully connected to DB.");
            this.isConnected = true;
        })
        .catch(e=>{
            console.log(e);
            this.isConnected = false;
        });
    }
    async getUserTradeLink(steamid, cb) {
        return await User.findOne({steamid:steamid}).then(user => {
            return cb(user.tradeUrl);
        }).catch(() => {return {error: 99}})
    }

    async updateAndGetUserTradeLink(steamid, token, partnerid, cb){
        const steam_link = STEAM_TRADE_LINK + "?" + STEAM_LINK_PARAM_PARTNER + partnerid + "&" + STEAM_LINK_PARAM_TOKEN + token;
        return await User.findOneAndUpdate({steamid: steamid}, {tradeUrl: steam_link},{new: true}).then(user => {
            return cb(user.tradeUrl);
        }).catch(() => {return {error: 99}});
    }
}

module.exports = Database;