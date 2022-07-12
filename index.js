let uniqid = require('uniqid');
let axios = require("axios");
let crypto = require('crypto');

// Load Env Variables
let env = require("dotenv");
env.config({
    path: './keys.env'
});

process.on('uncaughtException', function(err) {
    console.log(err)
})

const SECRET = process.env.SECRET;
const ACCESS = process.env.ACCESS;
const API = "https://sandboxapi.rapyd.net";

const rapyd = axios.create({
    baseURL: API,
    headers: {
        "access_key": ACCESS,
        "Content-Type": "application/json",
    }
})

// Add a request interceptor
rapyd.interceptors.request.use(function(config) {
    // Do something before request is sent
    let salt = generateRandomString(8);
    let idempotency = new Date().getTime().toString();
    let timestamp = (Math.floor(new Date().getTime() / 1000) - 10).toString();
    // Current Unix time (seconds).

    config.headers["signature"] = sign(config.method, config.url, salt, timestamp, config.data);
    config.headers["idempotency"] = idempotency;
    config.headers["timestamp"] = timestamp;
    config.headers["salt"] = salt;
    // console.log(config);
    return config;
}, function(error) {
    // Do something with request error
    // console.log(error);
});


function sign(method, urlPath, salt, timestamp, body) {
    try {
        let bodyString = "";
        if (body) {
            bodyString = JSON.stringify(body);
            bodyString = bodyString == "{}" ? "" : bodyString;
        }

        let toSign = method.toLowerCase() + urlPath + salt + timestamp + ACCESS + SECRET + bodyString;
        // console.log(`toSign: ${toSign}`);

        let hash = crypto.createHmac('sha256', SECRET);
        hash.update(toSign);
        const signature = Buffer.from(hash.digest("hex")).toString("base64")
        // console.log(`signature: ${signature}`);

        return signature;
    } catch (error) {
        console.error("Error generating signature");
        throw error;
    }
}

function generateRandomString(size) {
    try {
        return crypto.randomBytes(size).toString('hex');
    } catch (error) {
        console.error("Error generating salt");
        throw error;
    }
}

function Wallet() {
    let obj = {};
    obj.create = function(body,cb) {
        rapyd.post("/v1/user", body).then(response=>{
            if(cb){
                cb(response.data,false);
            }
        }
        ).catch(error=>{
            if(cb){
                cb(false,error.response.data);
            }
        }
        );
    }
    obj.getRef = function(name){
        return (name||"").split(" ").join("-") + "_" + generateRandomString(10);
    }
    obj.disable = function(ewallet,cb){
        let body = {ewallet};
        rapyd.put("/v1/user/disable", body).then(response=>{
            if(cb){
                cb(response.data,false);
            }
        }
        ).catch(error=>{
            if(cb){
                cb(false,error.response.data);
            }
        }
        );
    }
    obj.enable = function(ewallet,cb){
        let body = {ewallet};
        rapyd.put("/v1/user/enable", body).then(response=>{
            if(cb){
                cb(response.data,false);
            }
        }
        ).catch(error=>{
            if(cb){
                cb(false,error.response.data);
            }
        }
        );
    }
    obj.get = function(ewallet,cb){
        rapyd.get("/v1/user/" + ewallet).then(response=>{
            if(cb){
                cb(response.data,false);
            }
        }).catch(error=>{
            if(cb){
                cb(false,error.response.data);
            }
        });
    }
    obj.delete = function(ewallet,cb){
        rapyd.delete("/v1/user/" + ewallet).then(response=>{
            if(cb){
                cb(response.data,false);
            }
        }).catch(error=>{
            if(cb){
                cb(false,error.response.data);
            }
        });
    }
    return obj;
}

module.exports = Wallet;