const express = require('express');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const expressGraphQL = require('express-graphql');
const next = require('next');

const Auth = require('./serverClass/Auth');
const SteamBot = require('./serverClass/SteamBot');
const Database = require('./serverClass/Database');
const OfferCronJob = require('./serverClass/OfferCronJob');
const GraphqlApi = require('./serverClass/GraphqlApi');
const config = require('./config');

let keys;
if(process.env.NODE_ENV === 'production') {
    keys = {
        "bot_id": process.env.BOT_ID,
        "bot_display_name": process.env.BOT_DISPLAY_NAME,
        "bot_username": process.env.BOT_USERNAME,
        "bot_password": process.env.BOT_PASSWORD,
        "bot_identity_secret": process.env.BOT_IDENTITY_SECRET,
        "bot_shared_secret": process.env.BOT_SHARED_SECRET,
        "mongoUrl": process.env.MONGO_URL,
        "steamApi": process.env.STEAM_API,
        "createDummyOfferKey": process.env.CREATE_DUMMY_OFFER_KEY,
    };
} else {
    keys = require('./keys');
}


const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const indexPage = '/';
const mainPage = '/dashboard';

const bot = new SteamBot(keys, config.INITIAL_OFFER_CANCEL_TIME);
const db = new Database(keys);
const graphqlApi = new GraphqlApi(bot, db, keys);
const offerCronJob = new OfferCronJob(bot, db, config.CHECK_OFFERS_IN_MINUTES, config.ITEMS_TRADE_BAN_EXPIRE);
const auth = new Auth(indexPage, mainPage, keys);
const store = new MongoDBStore({
    uri: keys.mongoUrl,
    collection: 'authSession'
})

auth.setup();
app.prepare().then(() => {
    const server = express();

    server.use(session({
        name: 'session_id',
        secret: 'secret_key',
        resave: true,
        saveUninitialized: true,
        rolling: true,
        cookie: {
            maxAge: 900000
        },
        store: store
    }));
    auth.initialize(server);

    server.get(/^\/auth\/((login)|(return))$/, auth.authenticate(), (req, res) => {
        res.redirect(mainPage);
    });

    server.get('/auth/logout', (req, res) => {
        req.logout();
        res.redirect(indexPage);
    });

    server.all('/api', expressGraphQL({
        graphiql: true,
        schema: graphqlApi.getAuthRootQuery()
    }));

    server.all('*', (req, res) => {
        return handle(req, res)
    });

    server.listen(port, err => {
        if (err) throw err;
        console.log(`> Ready on website http://localhost:${port}`)
    })
});