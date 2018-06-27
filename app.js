const { HLTV } = require(`hltv`)

const xyz = document.getElementById(`test`)
xyz.innerHTML = `hey`

const liveMatches = []
let html = ``;
window.onload = function(){
    chrome.extension.getBackgroundPage().console.log(`he`)
    xyz.innerHTML = `loaded! ${Date()}`
    HLTV.getMatches()
        .then((matches) => {
            chrome.extension.getBackgroundPage().console.log(`got matches`)
            for (let i = 0; i < matches.length; i++){
                if (matches[i].live){
                    chrome.extension.getBackgroundPage().console.log(`live`)
                    liveMatches.push(matches[i])
                } else {
                    chrome.extension.getBackgroundPage().console.log(`could`)
                }
                
            }
            for (let v = 0; v < liveMatches.length; v++){
                html = html+`${liveMatches[v].team1.name} vs ${liveMatches[v].team2.name} | `
                chrome.extension.getBackgroundPage().console.log(`lol`);
            }
            xyz.innerHTML =  html;
        })
}
