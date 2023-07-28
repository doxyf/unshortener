const fetch = require("node-fetch-commonjs");
const cheerio = require('cheerio');

module.exports.main = async function(link){
    const res = await fetch(link);
    const cookies = res.headers.raw()["set-cookie"].map(element => elemetnt = element.split('; expires')[0]).join('; ')

    const restext = await res.text();
    const $ = cheerio.load(restext);

    const special_id = $('[name=special_id]')[0].attribs.value;
    const _token = $('[name=_token]')[0].attribs.value;

    var epicform = new FormData();
    epicform.append('_token', _token);
    epicform.append('tos_accepted', "1");
    epicform.append('privacy_accepted', "1",);
    epicform.append('special_id', special_id);

    const res2 = await fetch(link, {method: 'POST', headers: {  'content-type':'application/x-www-form-urlencoded' }, body: epicform, headers: {"cookie": cookies}});

    return res2.url;
}