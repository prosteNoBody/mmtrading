const OFFER_STATE = require('../types/OfferState');
const TRADE_STATE = require('../types/TradeState');
const TRADE_FILTER = {
    "ACTIVE_ONLY": 1,
    "HISTORICAL_ONLY": 2,
    "ALL": 3
}

class OfferCronJob {
    constructor(steamBot, db, checkTimerInMinutes, itemTradeBanInDays){
        this.steamBot = steamBot;
        this.db = db;
        this.checkTimerInMinutes = checkTimerInMinutes * 60 * 1000;
        this.itemTradeBanInDays = itemTradeBanInDays;

        this.steamBot.client.on('webSession',() => {
            this.initEventsWhenReady();
            this.activateCronJobs();
        });
    }
    initEventsWhenReady() {
        this.steamBot.manager.on('newOffer', trade => {
            trade.decline();
        })
        this.steamBot.manager.on('sentOfferChanged', async (trade, oldOfferState) => {
            try {
                const offer = await this.db.getOfferFromTradeId(trade.id);
                if(trade.state === TRADE_STATE.Accepted) {
                    if(offer.status === OFFER_STATE.INITIAL_CREATE) {
                        trade.getExchangeDetails(false, (err, status, tradeInitTime, receivedItems, sentItems) => {
                            for(let receivedItem of receivedItems) {
                                offer.items[offer.items.indexOf(receivedItem.assetid)] = receivedItem.new_assetid;
                            }
                            this.db.checkInReceivedItems(offer.id, offer.items);
                        });
                    } else if(offer.status === OFFER_STATE.BOT_READY) {
                        await this.db.setOfferAsWithdraw(offer.id);
                        await this.db.clearTradeId(offer.id);
                    } else if(offer.status === OFFER_STATE.BUYER_PAY) {
                        await this.db.setOfferAsCompleted(offer.id);
                        await this.db.clearTradeId(offer.id);
                    }
                } else if(trade.state !== TRADE_STATE.InEscrow && trade.state !== TRADE_STATE.Active) {
                    if(offer.status === OFFER_STATE.INITIAL_CREATE) {
                        await this.db.setInitialOfferStatus(trade.id, OFFER_STATE.OFFER_CANCELED);
                    }
                    await this.db.clearTradeId(offer.id);
                } else {
                    trade.decline();
                }
            } catch (e) {
                console.log(e);
            }
        })
    }
    activateCronJobs() {
        this.checkIfOffersReady().then();
        this.cronJob = setInterval(async () => {
            this.checkIfOffersReady().then();
        }, this.checkTimerInMinutes);
    }
    async checkIfOffersReady() {
        let offers = await this.db.getAllHoldingOffers();
        for(let offer of offers) {
            let daysBetween = (new Date().getTime() - new Date(offer.date).getTime()) / (1000 * 60 * 60 * 24);
            if(daysBetween > this.itemTradeBanInDays) {
                this.db.setOfferForWithdraw(offer.id).then().catch(()  => {
                    console.log("Cannot set offer for withdraw, offerId: " + offer.id);
                });
            }
        }
    }
}

module.exports = OfferCronJob;