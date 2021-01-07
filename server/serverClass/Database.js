const mongoose = require('mongoose');
const uuid = require('uuid');

const User = require('../models/User');
const Offer = require('../models/Offer');

const OFFER_STATE = require('../types/OfferState');

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

    async createNewOffer(steamid, tradeid, items, price) {
        return new Promise((resolve, reject) => {
            new Offer({
                id: uuid.v4(),
                trade_id: tradeid,
                user_id: steamid,
                items: items,
                price: price,
                date: (new Date()).toISOString(),
                status: OFFER_STATE.INITAL_CREATE,
            }).save().then( offer => {
                return resolve(offer.id);
            })
        })
    }

    async getOfferFromTradeId(tradeId) {
        return new Promise((resolve, reject) => {
            Offer.findOne({trade_id: tradeId}).then(offer => {
                resolve(offer);
            }).catch(e => console.log(e));
        })
    }

    async setOfferStatus(tradeId, status) {
        return new Promise((resolve, reject) => {
            Offer.findOneAndUpdate({trade_id: tradeId}, {status: status}).then(() => {
                resolve();
            })
        })
    }

    async removeActiveTradeOffer(offer_id) {
        return new Promise((resolve, reject) => {
            Offer.findOneAndUpdate({id: offer_id}, {trade_id: ""}).then(() => {
                resolve();
            })
        })
    }

    async checkInReceivedItems(offer_id, items) {
        return new Promise((resolve, reject) => {
            Offer.findOneAndUpdate({id: offer_id}, {
                items: items,
                trade_id: "",
                date: (new Date()).toISOString(),
                status: OFFER_STATE.BOT_HOLDING,
            }).then(() => {
                resolve();
            }).catch(e => console.log(e));
        })
    }

    async getAllHoldingOffers() {
        return new Promise((resolve, reject) => {
            Offer.find({status: OFFER_STATE.BOT_HOLDING}).then( offers => {
                resolve(offers);
            }).catch(e => console.log(e));
        })
    }

    async setOfferForWithdraw(offerId) {
        Offer.findOneAndUpdate({id: offerId}, {
            status: OFFER_STATE.BOT_READY,
            date: (new Date()).toISOString(),
        }).catch(e => console.log(e))
    }
}

module.exports = Database;