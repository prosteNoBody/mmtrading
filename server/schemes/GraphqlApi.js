const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLInt,
    GraphQLString,
    GraphQLList,
    GraphQLBoolean
} = require('graphql');

const { extractTokenFromUrl } = require('../helpFunctions');

class GraphqlApi {
    constructor(steamBot, db){
        this.steamBot = steamBot;
        this.database = db;

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

        this.CreateOfferResponse = new GraphQLObjectType({
            name: 'CreateOfferResponse',
            description: 'Return offer response',
            fields: () => ({
                error: {type: GraphQLInt},
                success: {type: GraphQLBoolean}
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
                inventory: {
                    type: this.InventoryType,
                    descriptions: 'Result inventory data',
                    resolve: (parent, args, req) => {
                        if(!req.user) return {error: "You are required to be logged in! Please re/login first."};
                        return this.steamBot.GraphQLGetUserItems(req.user.steamid).then(items => {
                            return {items: items};
                        }).catch(error => {
                            return {error: error};
                        });
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
                        if(tradeUrl){
                            return await db.getUserTradeLink(req.user.steamid, async tradeLink => {
                                if(tradeLink === tradeUrl){
                                    return { error: 2 }
                                } else {
                                    let token = extractTokenFromUrl(tradeUrl);
                                    if(!token) {
                                        return { error: 3 };
                                    }
                                    else if(await steamBot.isTokenValid(req.user.steamid, token)){
                                        const partnerid = steamBot.getPartnerId(req.user.steamid);
                                        return await db.updateAndGetUserTradeLink(req.user.steamid, token, partnerid, newTradeUrl => {
                                            return {tradeurl: newTradeUrl, changed: true};
                                        })
                                    } else {
                                        return { error: 4 }
                                    }
                                }
                            });
                        } else {
                            return await db.getUserTradeLink(req.user.steamid, tradeLink => {
                                return {tradeurl: tradeLink};
                            });
                        }
                    }
                },
                createOffer: {
                    type: this.CreateOfferResponse,
                    description: 'Update and fetch trade url',
                    args: {
                        items: {type: GraphQLList(GraphQLString)},
                    },
                    resolve: async (parent, { items }, req) => {
                        console.log(items);
                        return Math.random() > 0.5 ? {success: true} : {error: 1};
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