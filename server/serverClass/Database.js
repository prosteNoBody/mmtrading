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

    async createDummyWithdrawOffer(steamid, items) {
        return new Promise((resolve, reject) => {
            new Offer({
                id: uuid.v4(),
                trade_id: "",
                user_id: steamid,
                buyer_id: "",
                items: items,
                price: Math.ceil(Math.random() * 20),
                date: (new Date()).toISOString(),
                status: OFFER_STATE.BOT_READY,
            }).save().then(() => {
                resolve(true);
            }).catch(e => {
                console.log(e);
                reject(false);
            });
        });
    }

    async getUserCredit(steamid) {
        return new Promise((resolve, reject) => {
            User.findOne({steamid:steamid}).then(user => {
                resolve(user.credit);
            }).catch(e => console.log(e));
        });
    }

    async updateUserCredit(steamid, newCredit) {
        return new Promise((resolve, reject) => {
            User.findOneAndUpdate({steamid: steamid}, {
                credit: newCredit,
            }).then(() => {
                resolve();
            }).catch(e => console.log(e));
        })
    }

    async getUserTradeLink(steamid, cb) {
        return await User.findOne({steamid:steamid}).then(user => {
            return cb(user.tradeUrl);
        }).catch(() => {return {error: 99}})
    }

    async getUserTradeLinkNew(steamid) {
        return new Promise((resolve, reject) => {
            User.findOne({steamid: steamid}).then(user => {
                resolve(user.tradeUrl);
            }).catch(e => console.log(e))
        });
    }

    async updateAndGetUserTradeLink(steamid, token, partnerid, cb){
        const steam_link = STEAM_TRADE_LINK + "?" + STEAM_LINK_PARAM_PARTNER + partnerid + "&" + STEAM_LINK_PARAM_TOKEN + token;
        return await User.findOneAndUpdate({steamid: steamid}, {tradeUrl: steam_link},{new: true}).then(user => {
            return cb(user.tradeUrl);
        }).catch(() => {return {error: 99}});
    }

    async updateAndGetUserTradeLinkNew(steamid, token, partnerid) {
        return new Promise((resolve, reject) => {
            const steam_link = STEAM_TRADE_LINK + "?" + STEAM_LINK_PARAM_PARTNER + partnerid + "&" + STEAM_LINK_PARAM_TOKEN + token;
            User.findOneAndUpdate({steamid: steamid}, {
                tradeUrl: steam_link
            },{new: true}).then(user => {
                resolve(user.tradeUrl);
            }).catch(e => console.log(e));
        })
    }

    async createNewOffer(steamid, tradeid, items, price) {
        return new Promise((resolve, reject) => {
            new Offer({
                id: uuid.v4(),
                trade_id: tradeid,
                user_id: steamid,
                buyer_id: "",
                items: items,
                price: price,
                date: (new Date()).toISOString(),
                status: OFFER_STATE.INITIAL_CREATE,
            }).save().then(offer => {
                return resolve(offer.id);
            }).catch(e => console.log(e));
        })
    }

    async userAlreadyHaveWaitingOffer(steamid) {
        return new Promise((resolve, reject) => {
            Offer.find({
                user_id: steamid,
                status: OFFER_STATE.INITIAL_CREATE,
            }).then( offers => {
                if(offers.length === 0) {
                    resolve(false);
                } else {
                    resolve(true);
                }
            }).catch(e => console.log(e));
        });
    }

    async userAlreadyHaveActiveTrade(steamid, offerType) {
        return new Promise((resolve, reject) => {
            Offer.find({
                user_id: steamid,
                status: offerType,
            }).then( offers => {
                for(const offer of offers) {
                    if(offer.trade_id !== "") {
                        resolve(true);
                    }
                }
                resolve(false);
            }).catch(e => console.log(e))
        })
    }

    async userAlreadyHaveWithdrawOffer(steamid) {
        return new Promise((resolve, reject) => {
            Offer.find({
                user_id: steamid,
                trade_id: "",
                status: OFFER_STATE.BOT_READY,
            }).then( offers => {
                if(offers.length === 0) {
                    resolve(false);
                } else {
                    resolve(true);
                }
            }).catch(e => console.log(e))
        });
    }

    async getOfferFromTradeId(tradeId) {
        return new Promise((resolve, reject) => {
            Offer.findOne({trade_id: tradeId}).then(offer => {
                resolve(offer);
            }).catch(e => console.log(e));
        })
    }

    async setInitialOfferStatus(tradeId, status) {
        return new Promise((resolve, reject) => {
            Offer.findOneAndUpdate({trade_id: tradeId}, {status: status}).then(() => {
                resolve();
            }).catch(e => console.log(e))
        })
    }

    async getOffer(offerId) {
        return new Promise((resolve, reject) => {
            Offer.findOne({id: offerId}).then(offer => {
                resolve(offer);
            }).catch(e => console.log(e));
        });
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

    async setOfferAsBought(offerId, buyerId) {
        Offer.findOneAndUpdate({id: offerId}, {
            status: OFFER_STATE.BUYER_PAY,
            buyer_id: buyerId,
        }).catch(e => console.log(e));
    }

    async setOfferAsWithdraw(offerId) {
        Offer.findOneAndUpdate({id: offerId}, {
            status: OFFER_STATE.USER_WITHDRAW
        }).catch(e => console.log(e))
    }

    async setOfferAsCompleted(offerId) {
        Offer.findOneAndUpdate({id: offerId}, {
            status: OFFER_STATE.COMPLETED,
        }).catch(e => console.log(e));
    }

    async isWithdrawReady(steamId ,offerId) {
        return new Promise((resolve, reject) => {
            Offer.findOne({
                id: offerId,
                user_id: steamId,
            }).then(offer => {
                if(!offer || offer.status !== OFFER_STATE.BOT_READY) {
                    resolve(false);
                } else {
                    resolve(true);
                }
            }).catch(e => console.log(e));
        });
    }

    async isWithdrawActive(offerId) {
        return new Promise((resolve, reject) => {
            Offer.findOne({
                id: offerId,
            }).then(offer => {
                if(!offer || offer.trade_id === "") {
                    resolve(false);
                } else {
                    resolve(true);
                }
            }).catch(e => console.log(e));
        });
    }

    async isWithdrawOfBoughtItemsReady(steamId ,offerId) {
        return new Promise((resolve, reject) => {
            Offer.findOne({
                id: offerId,
                buyer_id: steamId,
            }).then(offer => {
                if(!offer || offer.status !== OFFER_STATE.BUYER_PAY) {
                    resolve(false);
                } else {
                    resolve(true);
                }
            }).catch(e => console.log(e));
        });
    }

    async isWithdrawOfBoughtItemsActive(offerId) {
        return new Promise((resolve, reject) => {
            Offer.findOne({
                id: offerId,
            }).then(offer => {
                if(!offer || offer.trade_id === "") {
                    resolve(false);
                } else {
                    resolve(true);
                }
            }).catch(e => console.log(e));
        });
    }

    async clearTradeId(offerId) {
        return new Promise((resolve, reject) => {
            Offer.findOneAndUpdate({id: offerId}, {
                trade_id: "",
            }).then(() => {
                resolve();
            }).catch(e => console.log(e));
        })
    }

    async setTradeId(offerId, tradeId) {
        return new Promise((resolve, reject) => {
            Offer.findOneAndUpdate({id: offerId}, {
                trade_id: tradeId,
            }).then(() => {
                resolve();
            }).catch(e => console.log(e));
        })
    }
}

module.exports = Database;