/**
 * @param {string | RegExp} url
 * @return {string} return changed
 */
const extractTokenFromUrl = (url) => {
    url = url.replace(/\s+/g,"");
    if(url.length > 8) {
        let res = /token=([A-Za-z0-9]{8})/.exec(url);
        if(res) {
            return res[1];
        } else {
            return "";
        }
    } else {
        url = url.replace(/[^A-Za-z0-9]/g,"");
        if(url.length === 8) {
            return url;
        }
        return "";
    }
}

const indexUsers = (users) => {
    let resUser = {};
    for(let user of users) {
        resUser[user.steamid] = {
            buyer_id: user.steamid,
            name: user.name,
            avatar: user.avatar,
        }
    }
    return resUser;
};

module.exports = {
    extractTokenFromUrl,
    indexUsers,
}