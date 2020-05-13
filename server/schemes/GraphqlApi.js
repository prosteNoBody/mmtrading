const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLInt,
    GraphQLString,
    GraphQLList
} = require('graphql');

class GraphqlApi {
    constructor(steamBot){
        this.steamBot = steamBot;

        this.ItemType = new GraphQLObjectType({
            name: 'Item',
            description: 'Represent item from inventory.',
            fields: () => ({
                index: {type: GraphQLInt},
                assetid: {type: GraphQLInt},
                name: {type: GraphQLString},
                icon_url: {type: GraphQLString},
                rarity: {type: GraphQLString},
                color: {type: GraphQLString},
                descriptions: {type: GraphQLList(GraphQLString)}
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
                        this.steamBot.getUserItemsGraphql(req.user.steamid,(error,items) => {
                            return {
                                error:error,
                                items:items,
                            }
                        })
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