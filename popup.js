document.getElementById("link").onclick = async function() {
    Loading();

    let date = new Date();
    date.setDate(date.getDate())
    
    let link = "https://www.kinovod" + parseDate(date) + ".cc";

    link = await checkConnection(link, date);
    console.log(link)
    
    window.open(link, '_blank').focus();
}

function parseDate(date){
    let day = date.getDate();
    let month = date.getMonth()+1;
    let year = date.getFullYear().toString().slice(2,4);
    if (day < 10) {
        day = '0' + day;
    }
    if (month < 10) {
        month = `0${month}`;
    }
    return day + month + year;
}

async function checkConnection(url, date){
    if(! await isSiteOnline(url))
    {
        for (let i = -5; i < 6; i++) {
            let tempDate = new Date(date)
            tempDate.setDate(date.getDate() + i);
            url = "https://www.kinovod" + parseDate(tempDate) + ".cc";  
            if(await isSiteOnline(url)){
                console.log(url + "   " + "yes")
                break;
            }
            else{
                console.log(url + "   " + "no")
            }
        }
    }
    return url
}

async function isSiteOnline(url) {
    return new Promise( (resolve, reject) => {
        // try to load favicon
        var timer = setTimeout(function(){
            // timeout after 5 seconds
            resolve(false);
        },5000)
    
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

function Loading(){
    let loader = document.getElementById("loader")
    let loaderText = document.getElementById("loaderText")
    loader.style.opacity = "1.0"
    loaderText.style.opacity = "1.0"
}