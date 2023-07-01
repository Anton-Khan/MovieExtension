document.addEventListener("DOMContentLoaded", function(){
    setTimeout(() => {
    link();
  }, "1"); 
}, false);

async function link() {
    let date = new Date();
    var url = getLinkfromDate(date);
        
    url = await checkURL(url, date);
    
    window.open(url, '_blank').focus();
    window.close();
}

function getLinkfromDate(date){
    let day = date.getDate();
    let month = date.getMonth()+1;
    let year = date.getFullYear().toString().slice(2,4);
    if (day < 10) {
        day = '0' + day;
    }
    if (month < 10) {
        month = `0${month}`;
    }
    return "https://www.kinovod" + day + month + year + ".cc";
}

async function checkURL(url, date){
    if(! await isSiteOnline(url))
    {
        for (let i = 1; i < 7; i++) {
            let newDate = new Date(date);
            
            let result = await checkNewURL(url, i, newDate, date );
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
                alert("Kinovod(дата).cc временно недоступен. Используйте VPN и следующую ссылку: kinovod.net")
        }
    }
    return url
}

async function checkNewURL(url, index, newDate, currentDate){
    return new Promise( async (resolve, reject) => {
        newDate.setDate(currentDate.getDate() + index);
        url = getLinkfromDate(newDate);  
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
