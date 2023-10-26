document.addEventListener("DOMContentLoaded", function(){
    setTimeout(() => {
    link();
  }, "1");
}, false);

var date;
var siteInfo;

async function link() {
    date = new Date();
    siteInfo = await getSiteInfo();

    let stringOfDate = getStringOfDate(date);
    var url = getURLFromStringOfDate(stringOfDate);

    url = await checkURL(url);
    await timeout(100);

    window.open(url, '_blank').focus();
    window.close();
}

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function getSiteInfo()
{
    return new Promise( (resolve, reject) => {
        chrome.storage.local.get(
            ["siteName", "siteDomain"],
            (items) => {
                resolve({ siteName: items.siteName, siteDomain: items.siteDomain });
            }
        );
    });
}

function getStringOfDate(date){
    let day = date.getDate();
    let month = date.getMonth()+1;
    let year = date.getFullYear().toString().slice(2,4);
    if (day < 10) {
        day = '0' + day;
    }
    else{
        day = '' + day;
    }

    if (month < 10) {
        month = `0${month}`;
    }
    else{
        month = '' + month;
    }
    return day + month + year;
}

function getURLFromStringOfDate(stringOfDate){
    return siteInfo.siteName + stringOfDate + siteInfo.siteDomain;
}

async function checkURL(url){
    if(! await isSiteOnline(url))
    {
        for (let i = 1; i < 7; i++) {
            let newDate = new Date(date);

            let result = await checkNewURL(url, i, newDate);
            if( result.passed ){
                url = result.url;
                break;
            }

            result = await checkNewURL(url, -i, newDate, date );
            if( result.passed  ){
                url = result.url;
                break;
            }

            if(i == 6)
                console.log(url)
                alert("Что-то пошло не так(")
        }
    }
    return url;
}

async function checkNewURL(url, index, newDate){
    return new Promise( async (resolve, reject) => {
        newDate.setDate(date.getDate() + index);
        let stringOfDate = await getStringOfDate(newDate)
        url = getURLFromStringOfDate(stringOfDate);

        if(await isSiteOnline(url)){
            console.debug(url + "   " + "PASS")
            resolve({passed : true, url : url});
        }
        else{
            console.debug(url + "   " + "NO CONNECTION")
            resolve({passed : false, url : url});
        }
    });
}

async function isSiteOnline(url) {
    return new Promise( (resolve, reject) => {
        // try to load favicon
        var timer = setTimeout(function(){
            resolve(false);
        },2000)

        var img = document.createElement("img");
        img.onload = function() {
            clearTimeout(timer);
            resolve(true);
        }

        img.onerror = function() {
            clearTimeout(timer);
            resolve(false);
        }

        img.src = url+"/favicon.ico";
    });
}
