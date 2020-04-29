const passport = require("passport");
const SteamStrategy = require("passport-steam").Strategy;
const User = require("../models/User");

class Auth{
    constructor(login,profile){
        this.siteLogin = login;
        this.siteProfile = profile;
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
            returnURL: 'http://localhost:3000/auth/return',
            realm: 'http://localhost:3000',
            apiKey: '2CCAB138EF94A1F80AE8E6D80D18990C'
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
            res.send({error:"You are required to be logged in! Please login first."});
        }
    };
    isAuth = (req,res,next) => {
        if(req.user){
            next();
        }else{
            res.redirect(this.siteLogin);
        }
    };
    isNotAuth = (req,res,next) => {
        if(!req.user){
            next();
        }else{
            res.redirect(this.siteProfile);
        }
    }
}

module.exports = Auth;