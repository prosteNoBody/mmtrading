const SteamUser = require("steam-user");
const SteamTotp = require('steam-totp');
const SteamCommunity = require('steamcommunity');
const TradeOfferManager = require('steam-tradeoffer-manager');

const config = require('../keys');

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
    constructor(config){
        this.config = new Config(config);
        this.client = new SteamUser();
        this.community = new SteamCommunity();
        this.manager = new TradeOfferManager({
            steam: this.client,
            community: this.community,
            language: 'en'
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
        this.client.on('webSession',(id,session) => {
            this.manager.setCookies(session);
            this.community.setCookies(session);

            //this.community.startConfirmationChecker(30000,this.config.bot_identity_secret);
        });
    }
    getUserItems(steamid,cb){
        let index = -1;
        this.manager.getUserInventoryContents(steamid,570,2,true, (err,inventory) => {
            if(!err){
                inventory = inventory.map(item => {
                    index++;
                    return{
                        index: index,
                        assetid:item.assetid,
                        name: item.market_name,
                        icon_url: item.getImageURL() + "200x200",
                        rarity: item.tags[1].name,
                        color: item.tags[1].color,
                    };
                });
            }
            cb(err,inventory);
        });
    }
}

module.exports = SteamBot;