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
const { extractTokenFromUrl } = require('../helpFunctions');

const OFFER_STATE = require('../types/OfferState');

class GraphqlApi {
    constructor(steamBot, db){
        this.DescriptionType = new GraphQLObjectType({
            name: 'Description',
            description: 'Description of item',
            fields: () => ({
                type: {type: GraphQLString},
                value: {type: GraphQLString},
                color: {type: GraphQLString},
            })
        });

        this.ItemType = new GraphQLObjectType({
            name: 'Item',
            description: 'Represent item from inventory.',
            fields: () => ({
                index: {type: GraphQLInt},
                assetid: {type: GraphQLString},
                name: {type: GraphQLString},
                icon_url: {type: GraphQLString},
                rarity: {type: GraphQLString},
                color: {type: GraphQLString},
                descriptions: {type: GraphQLList(this.DescriptionType)},
            })
        });

        this.InventoryType = new GraphQLObjectType({
            name: 'Inventory',
            description: 'Returning value from api contain error and items',
            fields: () => ({
                error: {type: GraphQLString},
                items: {type: GraphQLList(this.ItemType)}
            })
        });

        this.UserType = new GraphQLObjectType({
            name: 'UserInfo',
            description: 'User info',
            fields: () => ({
                steamid: {type: GraphQLString},
                name: {type: GraphQLString},
                avatar: {type: GraphQLString},
                credit: {type: GraphQLInt},
                tradeUrl: {type: GraphQLString},
            })
        })

        this.TradeUrl = new GraphQLObjectType({
            name: 'TradeUrl',
            description: 'tradelink resolver',
            fields: () => ({
                error: {type: GraphQLString},
                tradeurl: {type: GraphQLString},
                changed: {type: GraphQLBoolean}
            })
        })

        this.OfferResponse = new GraphQLObjectType({
            name: 'CreateOfferResponse',
            description: 'Return offer response',
            fields: () => ({
                error: {type: GraphQLInt},
                success: {type: GraphQLBoolean},
                link: {type: GraphQLString}
            })
        })

        this.Offer = new GraphQLObjectType({
            name: 'Offer',
            description: 'Return offer object',
            fields: () => ({
                id: {type: GraphQLString},
                is_mine: {type: GraphQLBoolean},
                user_id: {type: GraphQLString},
                buyer_id: {type: GraphQLString},
                trade_id: {type: GraphQLString},
                price: {type: GraphQLFloat},
                items: {type: GraphQLList(this.ItemType)},
                date: {type: GraphQLString},
                status: {type: GraphQLInt},
            })
        })

        this.AllOffersResolve = new GraphQLObjectType({
            name: 'OffersResolve',
            description: 'Return resolve for all offers',
            fields: () => ({
                error: {type: GraphQLInt},
                offers: {type: GraphQLList(this.Offer)}
            })
        })

        this.ResolveUserType = new GraphQLObjectType({
            name: 'User',
            description: 'Return value of user get query',
            fields: () => ({
                error: {type: GraphQLString},
                user: {type: this.UserType},
            })
        })

        this.RootAuthQueryType = new GraphQLObjectType({
            name: 'Query',
            description: 'Root Query',
            fields: () => ({
                createDummyWithdrawOffer: {
                    type: GraphQLBoolean,
                    args: {
                        key: {type: GraphQLString},
                    },
                    description: 'Create dummy offer from bot items to withdraw',
                    resolve: async (parent, { key }, req) => {
                        if (key !== createDummyOfferKey) {
                            return  false;
                        } else if(!req.user) {
                            return false;
                        } else {
                            let items = await steamBot.getBotItems();
                            if(items.length === 0) {
                                return false;
                            } else {
                                return await db.createDummyWithdrawOffer(req.user.steamid, [items[Math.floor(Math.random() * items.length)].assetid]);
                            }
                        }
                    }
                },
                inventory: {
                    type: this.InventoryType,
                    descriptions: 'Result inventory data',
                    resolve: async (parent, args, req) => {
                        if(!req.user) {
                            return {error: "You are required to be logged in! Please re/login first."};
                        } else {
                            try{
                                const items = await steamBot.GraphQLGetUserItems(req.user.steamid);
                                return {items: items};
                            } catch {
                                return {error: error};
                            }
                        }
                    }
                },
                getTradeUrl: {
                    type: this.TradeUrl,
                    description: 'Update and fetch trade url',
                    args: {
                        tradeUrl: {type: GraphQLString},
                        test: {type: GraphQLList(GraphQLString)}
                    },
                    resolve: async (parent, { tradeUrl }, req) => {
                        if(!req.user) {
                            return { error: 1 }
                        }
                        let tradeLink = await db.getUserTradeLinkNew(req.user.steamid);
                        if(tradeUrl){
                            if(tradeLink === tradeUrl){
                                return { error: 2 }
                            } else {
                                let token = extractTokenFromUrl(tradeUrl);
                                if(!token) {
                                    return { error: 3 };
                                }
                                else if(await steamBot.isTokenValid(req.user.steamid, token)){
                                    const partnerid = steamBot.getPartnerId(req.user.steamid);
                                    const newTradeUrl = await db.updateAndGetUserTradeLinkNew(req.user.steamid, token, partnerid);
                                    return {tradeurl: newTradeUrl, changed: true};
                                } else {
                                    return { error: 4 }
                                }
                            }
                        } else {
                            return {tradeurl: tradeLink};
                        }
                    }
                },
                createOffer: {
                    type: this.OfferResponse,
                    description: 'Create initial offer',
                    args: {
                        items: {type: GraphQLList(GraphQLString)},
                        price: {type: GraphQLString},
                    },
                    resolve: async (parent, { items, price }, req) => {
                        if (!req.user) {
                            return {error: 4};
                        } else if (!price || !Number(price) || Number(price) < 0) {
                            return {error: 5};
                        } else if (items.length === 0) {
                            return {error: 1};
                        } else {
                            price = Math.round(Number(price) * 100)/100;
                            if(!await steamBot.validateOfferItems(req.user.steamid, items)) {
                                return {error:3}
                            } else {
                                let tradeLink = await db.getUserTradeLinkNew(req.user.steamid);
                                if(!(tradeLink && await steamBot.isTokenValid(req.user.steamid, extractTokenFromUrl(tradeLink)))) {
                                    return {error: 2};
                                } else {
                                    if(await db.userAlreadyHaveWaitingOffer(req.user.steamid)) {
                                        return {error: 7};
                                    } else {
                                        try {
                                            let offerid = await steamBot.createNewOffer(tradeLink, items);
                                            let link = await db.createNewOffer(req.user.steamid, offerid, items, price);
                                            return { success: true, link: link };
                                        } catch {
                                            return {error: 6};
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                withdrawOffer: {
                    type: this.OfferResponse,
                    description: 'Withdraw offer',
                    args: {
                        offerid: {type: GraphQLString},
                    },
                    resolve: async (parent, { offerid }, req) => {
                        if (!req.user) {
                            return {error: 4};
                        } else {
                            const userTradeUrl = await db.getUserTradeLinkNew(req.user.steamid);
                            if(!await steamBot.isTokenValid(req.user.steamid, extractTokenFromUrl(userTradeUrl))) {
                                return {error: 2};
                            } else {
                                if(await db.userAlreadyHaveActiveTrade(req.user.steamid, OFFER_STATE.BOT_READY)){
                                    return {error: 5};
                                } else {
                                    if(!await db.isWithdrawReady(req.user.steamid ,offerid)) {
                                        return {error: 0};
                                    } else {
                                        if(await db.isWithdrawActive(offerid)) {
                                            return {error: 1};
                                        } else {
                                            const offer = await db.getOffer(offerid);
                                            if(!await steamBot.validateBotOfferItems(offer.items)) {
                                                return {error: 3};
                                            } else {
                                                try {
                                                    let tradeId = await steamBot.createWithdrawOffer(userTradeUrl, offer.items);
                                                    await db.setTradeId(offerid, tradeId);
                                                    return {success: true};
                                                } catch {
                                                    return {error: 6};
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                buyOffer: {
                    type: this.OfferResponse,
                    description: 'Buy offer',
                    args: {
                        offerid: {type: GraphQLString},
                    },
                    resolve: async (parent, { offerid }, req) => {
                        if (!req.user) {
                            return {error: 4};
                        } else {
                            const offer = await db.getOffer(offerid);
                            if(!offer) {
                                return {error: 1};
                            } else {
                                if(offer.user_id === req.user.steamid) {
                                    return {error: 2};
                                } else {
                                    if(offer.status !== OFFER_STATE.BOT_READY || offer.trade_id !== "") {
                                        return {error: 3};
                                    } else {
                                        const buyerCredit = await db.getUserCredit(req.user.steamid);
                                        if(buyerCredit < offer.price) {
                                            return {error: 5};
                                        } else {
                                            const sellerCredit = await db.getUserCredit(offer.user_id);
                                            await Promise.all([
                                                db.updateUserCredit(req.user.steamid, buyerCredit - offer.price),
                                                db.updateUserCredit(offer.user_id, sellerCredit + offer.price),
                                                db.setOfferAsBought(offer.id, req.user.steamid)
                                            ]);
                                            return {success: true};
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                withdrawBoughtItems: {
                    type: this.OfferResponse,
                    description: 'Withdraw bought offer',
                    args: {
                        offerid: {type: GraphQLString},
                    },
                    resolve: async (parent, { offerid }, req) => {
                        if (!req.user) {
                            return {error: 4};
                        } else {
                            const userTradeUrl = await db.getUserTradeLinkNew(req.user.steamid);
                            if(!await steamBot.isTokenValid(req.user.steamid, extractTokenFromUrl(userTradeUrl))) {
                                return {error: 2};
                            } else {
                                if(await db.userAlreadyHaveActiveTrade(req.user.steamid, OFFER_STATE.BUYER_PAY)) {
                                    return {error: 5};
                                } else {
                                    if(!await db.isWithdrawOfBoughtItemsReady(req.user.steamid ,offerid)) {
                                        return {error: 0};
                                    } else {
                                        if(await db.isWithdrawOfBoughtItemsActive(offerid)) {
                                            return {error: 1};
                                        } else {
                                            const offer = await db.getOffer(offerid);
                                            if(!await steamBot.validateBotOfferItems(offer.items)) {
                                                return {error: 3};
                                            } else {
                                                try {
                                                    let tradeId = await steamBot.createWithdrawOffer(userTradeUrl, offer.items);
                                                    await db.setTradeId(offerid, tradeId);
                                                    return {success: true};
                                                } catch {
                                                    return {error: 6};
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                getAllOffers: {
                    type: this.AllOffersResolve,
                    description: 'Get all offers owned by user',
                    args: {
                        method: {type: GraphQLBoolean},
                    },
                    resolve: async (parent, {method}, req) => {
                        if (!req.user) {
                            return {error: 1};
                        } else {
                            try {
                                let offers = method ? (await db.getUserOffers(req.user.steamid)) : (await db.getBoughtOffers(req.user.steamid));
                                let botItems = await steamBot.getBotItems(false);
                                let resOffer = [];
                                for(let offer of offers) {
                                    resOffer.push({
                                        id: offer.id,
                                        is_mine: offer.user_id === req.user.steamid,
                                        user_id: offer.user_id,
                                        buyer_id: offer.buyer_id,
                                        trade_id: offer.trade_id,
                                        price: offer.price,
                                        items: botItems.filter(item => offer.items.includes(item.assetid)),
                                        date: offer.date,
                                        status: offer.status,
                                    })
                                }
                                return {offers: resOffer};
                            } catch {
                                return {error: 2};
                            }
                        }
                    }
                },
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