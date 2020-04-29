const express = require("express");
const session = require("express-session");
const next = require("next");

const Auth = require("./serverClass/Auth");
const SteamBot = require("./serverClass/SteamBot");
const Database = require("./serverClass/Database");
const config = require("./keys");

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const indexPage = "/";
const mainPage = "/dashboard";

const bot = new SteamBot(config);
const db = new Database(config);
const auth = new Auth(indexPage, mainPage);

auth.setup();
app.prepare().then(() => {
    const server = express();

    server.use(session({
        name: "session_id",
        secret: "secret_key",
        resave: true,
        saveUninitialized: true,
        cookie: {
            maxAge: 900000
        }
    }));
    auth.initialize(server);

    server.get('/api/inventory', auth.apiIsAuth, (req, res) => {
        bot.getUserItems(req.user.steamid, (err, inventory) => {
            if (err) {
                res.send({ error: "File could not be loaded, your profile may be private!" });
            } else {
                res.send({inventory});
            }
        })
    });

    server.get(mainPage, auth.isAuth, (req, res) => {
        app.render(req, res, mainPage).then();
    });

    server.get(/^\/auth\/((login)|(return))$/, auth.authenticate(), (req, res) => {
        res.redirect(mainPage);
    });

    server.get('/auth/logout', (req, res) => {
        req.logout();
        res.redirect(indexPage);
    });

    server.get('/', auth.isNotAuth);

    server.all('*', (req, res) => {
        return handle(req, res)
    });

    server.listen(port, err => {
        if (err) throw err;
        console.log(`> Ready on website http://localhost:${port}`)
    })
});