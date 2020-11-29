const SteamUser = require("steam-user");
const SteamTotp = require('steam-totp');
const SteamCommunity = require('steamcommunity');
const TradeOfferManager = require('steam-tradeoffer-manager');

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
        this.client.on('steamGuard', (domain,cb) => {
            cb(SteamTotp.generateAuthCode(this.config.bot_shared_secret));
        });
        this.client.on('webSession',(id,session) => {
            this.manager.setCookies(session);
            this.community.setCookies(session);

            //this.community.startConfirmationChecker(30000,this.config.bot_identity_secret);
        });
    }
    getUserItems = (steamid,cb) => {
        this.manager.getUserInventoryContents(steamid,570,2,true, (error,inventory) => {
            if(error)
                error = "File could not be loaded, your profile may be private!";
            if(!error){
                inventory = inventory.map(item => {
                    return{
                        index: item.pos,
                        assetid:item.assetid,
                        name: item.market_name,
                        icon_url: item.getImageURL() + "200x200",
                        rarity: item.tags[1].name,
                        color: item.tags[1].color,
                    };
                });
            }
            cb(error,inventory);
        });
    };
    GraphQLGetUserItems = async (steamid) => {
        return new Promise((resolve, reject) => {
            this.manager.getUserInventoryContents(steamid,570,2,true, (error,inventory) => {
                if(error || typeof inventory == 'undefined'){
                    return reject(error);
                }
                inventory = inventory.map(item => {
                    if(!item.descriptions.length)
                        item.descriptions = [{type:"html",value:"No Descriptions"}];
                    return{
                        index: item.pos,
                        assetid:item.assetid,
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
}

module.exports = SteamBot;