const uuid = require('uuid');

const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLInt,
    GraphQLString,
    GraphQLList,
    GraphQLBoolean,
    GraphQLFloat
} = require('graphql');

const {createDummyOfferKey} = require('../keys.json');
const { extractTokenFromUrl, indexUsers } = require('../helpFunctions');

const OFFER_STATE = require('../types/OfferState');

class GraphqlApi {
    constructor(steamBot, db){
        this.DescriptionType = new GraphQLObjectType({
            name: 'PopisekSkinu',
            fields: () => ({
                type: {type: GraphQLString, description: 'Určuje typ popisku'},
                value: {type: GraphQLString, description: 'Určuje obsah popisku'},
                color: {type: GraphQLString, description: 'Určuje barvu popisku'},
            })
        });

        this.ItemType = new GraphQLObjectType({
            name: 'Skin',
            fields: () => ({
                index: {type: GraphQLInt, description: 'Pořadové číslo v steam inventáři'},
                assetid: {type: GraphQLString, description: 'SteamID pro skin'},
                name: {type: GraphQLString, description: 'Jméno skinu'},
                icon_url: {type: GraphQLString, description: 'Url odkaz na ikonku obrázku'},
                rarity: {type: GraphQLString, description: 'Název rarity skinu'},
                color: {type: GraphQLString, description: 'Hex kod barvy rarity skinu'},
                descriptions: {type: GraphQLList(this.DescriptionType), description: 'Pole s popisky u skinu'},
            })
        });

        this.InventoryType = new GraphQLObjectType({
            name: 'Inventory',
            fields: () => ({
                error: {type: GraphQLString, description: 'Důvod proč nešel načíst inventář'},
                items: {type: GraphQLList(this.ItemType), description: 'Jednotlivé předměty v poli'}
            })
        });

        this.UserType = new GraphQLObjectType({
            name: 'User',
            fields: () => ({
                steamid: {type: GraphQLString, description: 'SteamID pro uživatele'},
                name: {type: GraphQLString, description: 'Přezdívka uživatele na platformě steam'},
                avatar: {type: GraphQLString, description: 'Url odkaz na obrázek avatara uživatele'},
                credit: {type: GraphQLInt, description: 'Počet kreditů vlastněné uživatelem'},
                tradeUrl: {type: GraphQLString, description: 'Trade url uživatele'},
            })
        })

        this.OwnerType = new GraphQLObjectType({
            name: 'BuyerInfo',
            fields: () => ({
                owner_id: {type: GraphQLString, description: 'SteamID uživatele, který vlastní nabídku'},
                name: {type: GraphQLString, description: 'Přezdívka uživatele, který vlastní nabídku'},
                avatar: {type: GraphQLString, description: 'Url odkaz na obrázek avatara uživatele, který vlastní nabídku'},
            })
        })

        this.TradeUrl = new GraphQLObjectType({
            name: 'TradeUrl',
            description: 'tradelink resolver',
            fields: () => ({
                error: {type: GraphQLString, description: 'Kód chyby'},
                tradeurl: {type: GraphQLString, description: 'Trade url uživatele'},
                changed: {type: GraphQLBoolean, description: 'Vrací true, pokud byla url změněna'}
            })
        })

        this.OfferResponse = new GraphQLObjectType({
            name: 'ResponseNabidky',
            description: 'Return offer response',
            fields: () => ({
                error: {type: GraphQLInt, description: 'Kód chyby'},
                success: {type: GraphQLBoolean, description: 'Vrací true, pokud akce proběhla úspěšně'},
                link: {type: GraphQLString, description: 'Odkaz na nabídku'}
            })
        })

        this.CreditResponse = new GraphQLObjectType({
            name: 'ResponseKrediu',
            description: 'Return error or success boolean',
            fields: () => ({
                error: {type: GraphQLInt, description: 'Kód chyby'},
                success: {type: GraphQLBoolean, description: 'Vrací true, pokud akce proběhla úspěšně'},
                credit: {type: GraphQLFloat, description: 'Nový stav peněženky uživatele'},
            })
        })

        this.Offer = new GraphQLObjectType({
            name: 'Nabidka',
            fields: () => ({
                id: {type: GraphQLString, description: 'ID nabídky'},
                is_mine: {type: GraphQLBoolean, description: 'Vrací true, pokud je nabídka vlastněná přihlášeným uživatelem'},
                is_buyer: {type: GraphQLString, description: 'Vrací true, pokud je nabídka zakoupená přihlášeným uživatelem'},
                owner: {type: this.OwnerType, description: 'Vrací objekt, majitele nabídky'},
                buyer_id: {type: GraphQLString, description: 'SteamID kupujícího'},
                trade_id: {type: GraphQLString, description: 'SteamID kupujícího'},
                price: {type: GraphQLFloat, description: 'Cena nabídky'},
                items: {type: GraphQLList(this.ItemType), description: 'Pole s ID skinů'},
                date: {type: GraphQLString, description: 'Datum nabídky'},
                status: {type: GraphQLInt, description: 'Status nabídky'},
            })
        })

        this.OneOfferResolve = new GraphQLObjectType({
            name: 'ResponseJedneNabidky',
            fields: () => ({
                error: {type: GraphQLInt, description: 'Kód chyby'},
                offer: {type: this.Offer, description: 'Vrací jednu konkrétní nabídku'},
            })
        })

        this.AllOffersResolve = new GraphQLObjectType({
            name: 'ResponseViceroNabidek',
            fields: () => ({
                error: {type: GraphQLInt, description: 'Kód chyby'},
                offers: {type: GraphQLList(this.Offer), description: 'Vrací vícero nabídek v poli'}
            })
        })

        this.RootAuthQueryType = new GraphQLObjectType({
            name: 'MMTrading',
            fields: () => ({
                createDummyWithdrawOffer: {
                    type: GraphQLBoolean,
                    args: {
                        key: {type: GraphQLString},
                    },
                    description: 'TESTOVACÍ | Slouží k vytvoření nabídky u steam bota z volných předmětů',
                    resolve: async (parent, { key }, req) => {
                        if(createDummyOfferKey === '') {
                            return false;
                        }
                        if (key !== createDummyOfferKey) {
                            return  false;
                        }
                        if(!req.user) {
                            return false;
                        }

                        let items = await steamBot.getBotItems();

                        if(items.length === 0) {
                            return false;
                        }
                        return await db.createDummyWithdrawOffer(req.user.steamid, [items[Math.floor(Math.random() * items.length)].assetid]);
                    }
                },
                getInventory: {
                    type: this.InventoryType,
                    description: 'Vrací skiny z inventáře uživatele',
                    resolve: async (parent, args, req) => {
                        if(!req.user) {
                            return {error: "You are required to be logged in! Please re/login first."};
                        }
                        try{
                            const items = await steamBot.GraphQLGetUserItems(req.user.steamid);
                            return {items: items};
                        } catch (e) {
                            console.log(e)
                            return {error: error};
                        }
                    }
                },
                getTradeUrl: {
                    type: this.TradeUrl,
                    description: 'Slouží k získání url, pokud je v parametru nová url tak jí přenastaví a vrací',
                    args: {
                        tradeUrl: {type: GraphQLString},
                        test: {type: GraphQLList(GraphQLString)}
                    },
                    resolve: async (parent, { tradeUrl }, req) => {
                        if(!req.user) {
                            return { error: 1 }
                        }
                        try{
                            let tradeLink = await db.getUserTradeLinkNew(req.user.steamid);
                            if(!tradeUrl) {
                                return {tradeurl: tradeLink};
                            }
                            if(tradeLink === tradeUrl){
                                return { error: 16 }
                            }
                            let token = extractTokenFromUrl(tradeUrl);
                            if(!token) {
                                return { error: 17 };
                            }
                            if(!await steamBot.isTokenValid(req.user.steamid, token)) {
                                return { error: 18 }
                            }
                            const partnerid = steamBot.getPartnerId(req.user.steamid);
                            const newTradeUrl = await db.updateAndGetUserTradeLinkNew(req.user.steamid, token, partnerid);
                            return {tradeurl: newTradeUrl, changed: true};
                        } catch (e) {
                            console.log(e)
                            return { error: 99 };
                        }
                    }
                },
                createOffer: {
                    type: this.OfferResponse,
                    description: 'Vytvoří nabídku - v parametrech je nutné ovést cenu a ID skinů v poli',
                    args: {
                        items: {type: GraphQLList(GraphQLString)},
                        price: {type: GraphQLString},
                    },
                    resolve: async (parent, { items, price }, req) => {
                        if (!req.user) {
                            return {error: 1};
                        }
                        if (!price || !Number(price) || Number(price) < 0) {
                            return {error: 12};
                        }
                        if (items.length === 0) {
                            return {error: 9};
                        }
                        price = Math.round(Number(price) * 100)/100;
                        if(!await steamBot.validateOfferItems(req.user.steamid, items)) {
                            return {error: 11}
                        }
                        try {
                            let tradeLink = await db.getUserTradeLinkNew(req.user.steamid);
                            if(!(tradeLink && await steamBot.isTokenValid(req.user.steamid, extractTokenFromUrl(tradeLink)))) {
                                return {error: 2};
                            }
                            if(await db.userAlreadyHaveWaitingOffer(req.user.steamid)) {
                                return {error: 14};
                            }
                            try {
                                const offerId = uuid.v4();
                                let offerid = await steamBot.createNewSteamTrade(tradeLink, items, offerId);
                                let link = await db.createNewOffer(req.user.steamid, offerid, items, price, offerId);
                                return { success: true, link: link };
                            } catch {
                                return {error: 13};
                            }
                        } catch (e) {
                            console.log(e)
                            return {error: 99};
                        }
                    }
                },
                withdrawOffer: {
                    type: this.OfferResponse,
                    description: 'Zruší nabídku uživatelem - v parametru je potřeba uvést platné id nabídky',
                    args: {
                        offerid: {type: GraphQLString},
                    },
                    resolve: async (parent, { offerid }, req) => {
                        if (!req.user) {
                            return {error: 1};
                        }
                        try {
                            const offer = await db.getOffer(offerid);
                            if(!offer) {
                                return {error: 7};
                            }
                            const userTradeUrl = await db.getUserTradeLinkNew(req.user.steamid);
                            if(!await steamBot.isTokenValid(req.user.steamid, extractTokenFromUrl(userTradeUrl))) {
                                return {error: 2};
                            }
                            if(await db.userAlreadyHaveActiveTrade(req.user.steamid, OFFER_STATE.BOT_READY)){
                                return {error: 5};
                            }
                            if(offer.status !== OFFER_STATE.BOT_READY || offer.owner_id !== req.user.steamid) {
                                return {error: 3};
                            }
                            if(!await steamBot.validateBotOfferItems(offer.items)) {
                                return {error: 4};
                            }
                            try {
                                let tradeId = await steamBot.createWithdrawSteamTrade(userTradeUrl, offer.items, offer.id);
                                await db.setTradeId(offerid, tradeId);
                                return {success: true};
                            } catch {
                                return {error: 6};
                            }
                        } catch (e) {
                            console.log(e)
                            return {error: 99};
                        }
                    }
                },
                buyOffer: {
                    type: this.OfferResponse,
                    description: 'Zakoupí nabídku - v parametrech je potřeba uvést platné id nabídky',
                    args: {
                        offerid: {type: GraphQLString},
                    },
                    resolve: async (parent, { offerid }, req) => {
                        if (!req.user) {
                            return {error: 1};
                        }
                        try {
                            const offer = await db.getOffer(offerid);
                            if(!offer) {
                                return {error: 7};
                            }
                            if(offer.owner_id === req.user.steamid) {
                                return {error: 8};
                            }
                            if(offer.status !== OFFER_STATE.BOT_READY) {
                                return {error: 3};
                            }
                            if(offer.trade_id !== "") {
                                return {error: 19}
                            }
                            const buyerCredit = await db.getUserCredit(req.user.steamid);
                            if(buyerCredit < offer.price) {
                                return {error: 20};
                            }
                            const sellerCredit = await db.getUserCredit(offer.owner_id);
                            await Promise.all([
                                db.updateUserCredit(req.user.steamid, buyerCredit - offer.price),
                                db.updateUserCredit(offer.owner_id, sellerCredit + offer.price),
                                db.setOfferAsBought(offer.id, req.user.steamid)
                            ]);
                            return {success: true};
                        } catch (e) {
                            console.log(e)
                            return {error: 99};
                        }
                    }
                },
                withdrawBoughtItems: {
                    type: this.OfferResponse,
                    description: 'Vybere předměty ze zakoupených nabídek, k vybrání předmětů - jako parametr je potřeba uvést platné offer id',
                    args: {
                        offerid: {type: GraphQLString},
                    },
                    resolve: async (parent, { offerid }, req) => {
                        if (!req.user) {
                            return {error: 1};
                        }
                        try {
                            const offer = await db.getOffer(offerid);
                            if(!offer) {
                                return {error: 7};
                            }
                            const userTradeUrl = await db.getUserTradeLinkNew(req.user.steamid);
                            if(!await steamBot.isTokenValid(req.user.steamid, extractTokenFromUrl(userTradeUrl))) {
                                return {error: 2};
                            }
                            if(await db.userAlreadyHaveActiveTrade(req.user.steamid, OFFER_STATE.BUYER_PAY)) {
                                return {error: 5};
                            }
                            if(offer.status !== OFFER_STATE.BUYER_PAY || offer.buyer_id !== req.user.steamid) {
                                return {error: 3};
                            }
                            if(!await steamBot.validateBotOfferItems(offer.items)) {
                                return {error: 4};
                            }
                            try {
                                let tradeId = await steamBot.createWithdrawSteamTrade(userTradeUrl, offer.items, offer.id);
                                await db.setTradeId(offerid, tradeId);
                                return {success: true};
                            } catch {
                                return {error: 6};
                            }
                        } catch (e) {
                            console.log(e)
                            return {error: 99};
                        }
                    }
                },
                getAllOffers: {
                    type: this.AllOffersResolve,
                    description: 'Vrací seznam všech nabídek vlastněné uživatelem - podle parametru jde přepnou na zakoupené nabídky',
                    args: {
                        method: {type: GraphQLBoolean},
                    },
                    resolve: async (parent, {method}, req) => {
                        if (!req.user) {
                            return {error: 1};
                        }
                        try {
                            const offers = method ? (await db.getUserOffers(req.user.steamid)) : (await db.getBoughtOffers(req.user.steamid));
                            const botItems = await steamBot.getBotItems(false);
                            const user = indexUsers(await db.getAllUsers());
                            let resOffer = [];
                            for(let offer of offers) {
                                resOffer.push({
                                    id: offer.id,
                                    is_mine: offer.owner_id === req.user.steamid,
                                    is_buyer: offer.buyer_id === req.user.steamid,
                                    owner: user[offer.owner_id],
                                    buyer_id: offer.buyer_id,
                                    trade_id: offer.trade_id,
                                    price: offer.price,
                                    items: botItems.filter(item => offer.items.includes(item.assetid)),
                                    date: offer.date,
                                    status: offer.status,
                                })
                            }
                            return {offers: resOffer};
                        } catch (e) {
                            console.log(e)
                            return {error: 15};
                        }
                    }
                },
                getOffer: {
                    type: this.OneOfferResolve,
                    description: 'Vrací jednu konkrétní nabídku - jako parametr musíte uvést platnou id nabídky',
                    args: {
                        offerId: {type: GraphQLString},
                    },
                    resolve: async (parent, {offerId}, req) => {
                        if (!req.user) {
                            return {error: 1};
                        }
                        try {
                            const offer = await db.getOffer(offerId);
                            const botItems = await steamBot.getBotItems(false);
                            const owner = await db.getUser(offer.owner_id);
                            return {offer: {
                                    id: offer.id,
                                    is_mine: offer.owner_id === req.user.steamid,
                                    is_buyer: offer.buyer_id === req.user.steamid,
                                    owner: owner,
                                    buyer_id: offer.buyer_id,
                                    trade_id: offer.trade_id,
                                    price: offer.price,
                                    items: botItems.filter(item => offer.items.includes(item.assetid)),
                                    date: offer.date,
                                    status: offer.status,
                            }};
                        } catch (e) {
                            console.log(e)
                            return {error: 15};
                        }
                    }
                },
                getCredit: {
                    type: this.CreditResponse,
                    description: 'Slouží pro přidání kreditu na účet uživatele - jako parametr si volíte možnost, která určuje počet kreditů',
                    args: {
                        option: {type: GraphQLInt},
                    },
                    resolve: async (parent, {option}, req) => {
                        if (!req.user) {
                            return {error: 1};
                        }
                        let creditResult;
                        switch (option) {
                            case 1:
                                creditResult = 5;
                                break;
                            case 2:
                                creditResult = 25;
                                break;
                            case 3:
                                creditResult = 50;
                                break;
                        }
                        if(!creditResult) {
                            return {error: 21};
                        }
                        try {
                            const userCredit = await db.getUserCredit(req.user.steamid);
                            const newCredit = await db.updateUserCredit(req.user.steamid, userCredit + creditResult);
                            return {success: true, credit: newCredit};
                        } catch {
                            return {error: 99}
                        }
                    }
                }
            })
        })
    }

    getAuthRootQuery = () => {
        return new GraphQLSchema({
            query: this.RootAuthQueryType,
        });
    }
}

module.exports = GraphqlApi;