const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLInt,
    GraphQLString,
    GraphQLList
} = require('graphql');

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

        this.RootAuthQueryType = new GraphQLObjectType({
            name: 'Query',
            description: 'Root Query',
            fields: () => ({
                inventory: {
                    type: this.InventoryType,
                    descriptions: 'Result inventory data',
                    resolve: (parent, args, req) => {
                        if(!req.user) return {error:"You are required to be logged in! Please re/login first."};
                        return this.steamBot.GraphQLGetUserItems(req.user.steamid).then(items => {
                            return {items: items};
                        }).catch(error => {
                            return {error: error};
                        });
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