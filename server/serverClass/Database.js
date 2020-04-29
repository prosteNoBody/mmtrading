const mongoose = require("mongoose");
const User = require("../models/User");


class Config {
    /**
     * @param {{mongoUrl}} config
     */
    constructor(config) {
        this.dbUrl = config.mongoUrl;
    }
}

class Database{
    constructor(config){
        this.config = new Config(config);
        mongoose.connect(this.config.dbUrl,{useUnifiedTopology: true,useNewUrlParser: true})
        .then(()=>{
            console.log("Succesfully connected to DB.");
            this.isConnected = true;
        })
        .catch(e=>{
            console.log(e);
            this.isConnected = false;
        });
    }
}

module.exports = Database;