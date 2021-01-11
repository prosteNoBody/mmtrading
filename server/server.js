const express = require('express');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const expressGraphQL = require('express-graphql');
const next = require('next');

const Auth = require('./serverClass/Auth');
const SteamBot = require('./serverClass/SteamBot');
const Database = require('./serverClass/Database');
const OfferCronJob = require('./serverClass/OfferCronJob');
const GraphqlApi = require('./schemes/GraphqlApi');
const config = require('./keys');

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const indexPage = '/';
const mainPage = '/dashboard';

const bot = new SteamBot(config, 2);
const db = new Database(config);
const graphqlApi = new GraphqlApi(bot,db);
const offerCronJob = new OfferCronJob(bot, db, 0.5);
const auth = new Auth(indexPage, mainPage);
const store = new MongoDBStore({
    uri: config.mongoUrl,
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

    server.get('/api/inventory', auth.apiIsAuth, (req, res) => {
        bot.getUserItems(req.user.steamid, (error, inventory) => {
            if (error) {
                res.send({ error: error });
            } else {
                res.send({inventory});
            }
        })
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