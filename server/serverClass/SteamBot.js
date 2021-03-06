const SteamUser = require("steam-user");
const SteamTotp = require('steam-totp');
const SteamCommunity = require('steamcommunity');
const TradeOfferManager = require('steam-tradeoffer-manager');
const SteamId = require('steamid')

const DOTA_APP_ID = 570;
const CONTEXT_ID = 2;

class Config {
    constructor(config) {
        this.bot_id = config.bot_id;
        this.bot_display_name = config.bot_display_name;
        this.bot_username = config.bot_username;
        this.bot_password = config.bot_password;
        this.bot_identity_secret = config.bot_identity_secret;
        this.bot_shared_secret = config.bot_shared_secret;
    }
}

class SteamBot {
    constructor(config, cancelTimeInMinutes){
        this.config = new Config(config);
        this.client = new SteamUser();
        this.community = new SteamCommunity();
        this.manager = new TradeOfferManager({
            steam: this.client,
            community: this.community,
            language: 'en',
            cancelTime: cancelTimeInMinutes * 60 * 1000,
        });

        //login
        this.client.logOn({
            accountName: this.config.bot_username,
            password: this.config.bot_password,
            twoFactorCode: SteamTotp.generateAuthCode(this.config.bot_shared_secret,1),
        });
        this.client.on('loggedOn',() => {
            console.log(`Steam bot was successfully log in: ${this.config.bot_display_name} - ${this.config.bot_id}`);
        });
        this.client.on('steamGuard', (domain,cb) => {
            cb(SteamTotp.generateAuthCode(this.config.bot_shared_secret));
        });
        this.client.on('webSession',(id,session) => {
            this.manager.setCookies(session);
            this.community.setCookies(session);

            this.community.startConfirmationChecker(30000,this.config.bot_identity_secret);
        });
    }
    getBotItems = async (tradeable = true) => {
        return new Promise((resolve, reject) => {
            this.manager.getInventoryContents(570,2,tradeable, (error, inventory) => {
                if(error || typeof inventory == 'undefined'){
                    return reject("File could not be loaded, your profile may be private!");
                }
                inventory = inventory.map(item => {
                    if(!item.descriptions.length) {
                        item.descriptions = [{type: "html", value: "No Descriptions"}];
                    }
                    return{
                        index: item.pos,
                        assetid: item.assetid,
                        name: item.market_name,
                        icon_url: item.getImageURL() + "200x200",
                        rarity: item.tags[1].name,
                        color: item.tags[1].color,
                        descriptions: item.descriptions,
                    };
                });
                return resolve(inventory);
            })
        });
    };
    GraphQLGetUserItems = async (steamid) => {
        return new Promise((resolve, reject) => {
            this.manager.getUserInventoryContents(steamid,570,2,true, (error,inventory) => {
                if(error || typeof inventory == 'undefined'){
                    return reject("File could not be loaded, your profile may be private!");
                }
                inventory = inventory.map(item => {
                    if(!item.descriptions.length) {
                        item.descriptions = [{type: "html", value: "No Descriptions"}];
                    }
                    return{
                        index: item.pos,
                        assetid: item.assetid,
                        name: item.market_name,
                        icon_url: item.getImageURL() + "200x200",
                        rarity: item.tags[1].name,
                        color: item.tags[1].color,
                        descriptions: item.descriptions,
                    };
                });
                return resolve(inventory);
            })
        });
    };
    isTokenValid = async (steamid, token) => {
        return new Promise((resolve, reject) => {
            const testingOffer = this.manager.createOffer(steamid, token);
            testingOffer.getUserDetails(err => {
                resolve(!err);
            })
        })
    }
    validateOfferItems = async (steamid, items) => {
        let inventoryItems;
        try {
            inventoryItems = await this.GraphQLGetUserItems(steamid);
        } catch {
            return false;
        }
        inventoryItems = inventoryItems.map(inventoryItem => {
            return inventoryItem.assetid;
        })
        for(let i = 0; i < items.length; i++) {
            if(!inventoryItems.includes(items[i])) {
                return false;
            }
        }

        return true;
    }
    validateBotOfferItems = async (items) => {
        let inventoryItems;
        try {
            inventoryItems = await this.getBotItems();
        } catch {
            return false;
        }
        inventoryItems = inventoryItems.map(inventoryItem => {
            return inventoryItem.assetid;
        })
        for(let i = 0; i < items.length; i++) {
            if(!inventoryItems.includes(items[i])) {
                return false;
            }
        }

        return true;
    }

    /**
     * create initial item offer
     * @param  {string} tradeurl
     * @param  {Array.string} items
     * @param  {string} offerId
     */
    createNewSteamTrade = async (tradeurl, items, offerId) => {
        return new Promise((resolve, reject) => {
            let offer = this.manager.createOffer(tradeurl);
            items = items.map(item => {
                return {
                    assetid: item,
                    appid: DOTA_APP_ID,
                    contextid: CONTEXT_ID,
                }
            })
            offer.addTheirItems(items);
            offer.setMessage(`This offer created by mmtrading.com - offer id: ${offerId}`);
            offer.send(err => {
                if(err) {
                    return reject(err);
                } else {
                    return resolve(offer.id);
                }
            });
        })
    }

    /**
     * create initial item offer
     * @param  {string} tradeurl
     * @param  {Array.string} items
     * @param  {string} offerId
     */
    createWithdrawSteamTrade = async (tradeurl, items, offerId) => {
        return new Promise((resolve, reject) => {
            let offer = this.manager.createOffer(tradeurl);
            items = items.map(item => {
                return {
                    assetid: item,
                    appid: DOTA_APP_ID,
                    contextid: CONTEXT_ID,
                }
            })
            offer.addMyItems(items);
            offer.setMessage(`This offer created by mmtrading.com - offer id: ${offerId}`);
            offer.send(err => {
                if(err) {
                    return reject(err);
                } else {
                    return resolve(offer.id);
                }
            });
        })
    }

    /**
     * Converts 64 bit SteamID string to account ID.
     * @param  {string} steamid 64 bit SteamID.
     * @return {string}         Account ID.
     */
    getPartnerId = steamid => {
        const steamObject = new SteamId(steamid);
        return /[0-9]{9}/.exec(steamObject.getSteam3RenderedID())[0];
    }
}

module.exports = SteamBot;