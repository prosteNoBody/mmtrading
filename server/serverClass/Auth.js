const passport = require("passport");
const SteamStrategy = require("passport-steam").Strategy;
const User = require("../models/User");

class Auth{
    constructor(keys, config){
        this.API_KEY = keys.steamApi;
        this.RETURN_URL = config.RETURN_URL;
        this.REALM_URL = config.REALM_URL;
    }
    initialize = (server) => {
        server.use(passport.initialize());
        server.use(passport.session());
    };
    setup = () => {
        passport.serializeUser((user, done) => done(null, user.steamid));
        passport.deserializeUser((id, done) => {
            User.findOne({steamid:id})
                .then(user => {
                    done(null,user);
                });
        });
        passport.use(new SteamStrategy({
            returnURL: this.RETURN_URL,
            realm: this.REALM_URL,
            apiKey: this.API_KEY,
        }, (identifier, profile, done) => {
            /**
             * @param {Object} steamProfile - steam profile
             * @param {string} steamProfile.personaname - steam nickname
             * @param {string} steamProfile.avatarmedium - steam avatar
             */
            let steamProfile = profile._json;
            User.findOne({steamid:steamProfile.steamid}).then(user => {
                if(user){
                    if(user.name !== steamProfile.personaname || user.avatar !== steamProfile.avatarmedium){
                        User.findOneAndUpdate({steamid:user.steamid},{name:steamProfile.personaname,avatar: steamProfile.avatarmedium},{new:true})
                            .then(user=>{
                                done(null,user);
                            })
                    }else{
                        done(null,user);
                    }
                }else{
                    new User({
                        steamid:steamProfile.steamid,
                        name:steamProfile.personaname,
                        avatar:steamProfile.avatarmedium,
                        credit:0,
                        tradeUrl:'',
                    }).save().then((user)=>{
                        done(null,user);
                    });
                }
            })
        } ));
    };
    authenticate = () => {
        return passport.authenticate('steam', {failureRedirect: '/wrong'});
    };
    apiIsAuth = (req,res,next) => {
        if(req.user){
            next();
        }else{
            res.send({data:{error:"You are required to be logged in! Please re/login first."}});
        }
    };
}

module.exports = Auth;