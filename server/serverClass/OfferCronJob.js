const OFFER_STATE = require('../types/OfferState');
const TRADE_STATE = require('../types/TradeState');
const TRADE_FILTER = {
    "ACTIVE_ONLY": 1,
    "HISTORICAL_ONLY": 2,
    "ALL": 3
}

class OfferCronJob {
    constructor(steamBot, db, checkTimerInMinutes){
        this.steamBot = steamBot;
        this.db = db;
        this.checkTimerInMinutes = checkTimerInMinutes * 60 * 1000;

        this.steamBot.client.on('webSession',() => {
            this.initEventsWhenReady();
            this.activateCronJobs();
        });
    }
    initEventsWhenReady() {
        this.steamBot.manager.on('newOffer', offer => {
            offer.decline();
        })
        this.steamBot.manager.on('sentOfferChanged', async (trade, oldOfferState) => {
            console.log(trade.state);
            const offer = await this.db.getOfferFromTradeId(trade.id);
            if(trade.state === TRADE_STATE.Accepted) {
                if(offer.status === OFFER_STATE.INITAL_CREATE) {
                    trade.getExchangeDetails(false, (err, status, tradeInitTime, receivedItems, sentItems) => {
                        for(let receivedItem of receivedItems) {
                            offer.items[offer.items.indexOf(receivedItem.assetid)] = receivedItem.new_assetid;
                        }
                        this.db.checkInReceivedItems(offer.id, offer.items);
                    })
                } else if(offer.status === OFFER_STATE.BOT_READY) {

                }
            } else if(trade.state !== TRADE_STATE.InEscrow && trade.state !== TRADE_STATE.InvalidItems) {
                if(offer.status === OFFER_STATE.INITAL_CREATE) {
                    await this.db.setOfferStatus(trade.id, OFFER_STATE.OFFER_CANCELED);
                }
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
        console.log(offers);
        for(let offer of offers) {
            let daysBetween = (new Date().getTime() - new Date(offer.date).getTime()) / (1000 * 60 * 60 * 24);
            if(daysBetween > 7) {
                this.db.setOfferForWithdraw(offer.id).then();
            }
        }
    }
}

module.exports = OfferCronJob;