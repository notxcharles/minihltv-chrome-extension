// const {
//     HLTV
// } = require(`hltv`)
//const xyz = document.getElementById(`test`)
const body = document.getElementById(`body2`)

let templates = []
window.onload = function () {
    chrome.extension.getBackgroundPage().console.log(`Chrome extension has been loaded.`)
    let port = chrome.extension.connect({
        name: "Sample Communication"
    });
    port.onMessage.addListener(function (data) {
        //chrome.extension.getBackgroundPage().console.log(`Data has been recieved - ${JSON.stringify(data)}`)
        templates = []
        for (let i = 0; i < data.length; i++) {
            let match = data[i]
            let template = `<div class="match-preview" id="${match.team1.name}">\
            <div class="team-box">\
            <div class="team">\
            <img src="https://static.hltv.org/images/bigflags/300x200/${match.team1.countrycode}.png" class="team-L">\
            <div class="team-L-gradient">\
            <a href="hltv.org/team/${match.team1.teamid}/${match.team1.name}">\
            <img src="https://static.hltv.org/images/team/logo/${match.team1.teamid}" class="logo">\
            <div class="teamname">\ 
            ${match.team1.name} </div>\
            </a>\
            <div class="results">\
            <div class="result ${match.maps[0].result.length == 0 ? `result-x` : ``}">\
            ${match.maps[0].result.length == 0 ? `Unplayed` : match.maps[0].result.split(":")[0]} </div>\
            <div class="result ${match.maps[1].result.length == 0 ? `result-x` : ``}">\
            ${match.maps[1].result.length == 0 ? `Unplayed` : match.maps[1].result.split(":")[0]} </div>\
            <div class="result ${match.maps[2].result.length == 0 ? `result-x` : ``}">\
            ${match.maps[2].result.length == 0 ? `Unplayed` : match.maps[2].result.split(":")[0]} </div>\
            </div>\
            </div>\
            </div>\
            <div class="middle">\
            <div class="eventdetails">\
            <div class="starttime">\
            21:25</div>\
            <div class="eventname">\
            ${match.eventName}</div>\
            </div>\
            <div class="maps">\
            <div class="result">\
            ${match.maps[0].name} </div>\
            <div class="result">\
            ${match.maps[1].name} </div>\
            <div class="result">
            ${match.maps[2].name} </div>\
            </div>\
            </div>\
            <div class="team">\
            <img src="https://static.hltv.org/images/bigflags/300x200/${match.team2.countrycode}.png" class="team-R">\
            <div class="team-R-gradient">\
            <a href="hltv.org/team/${match.team2.teamid}/${match.team2.name}">\
            <img src="https://static.hltv.org/images/team/logo/${match.team2.teamid}" class="logo">\
            <div class="teamname">\ ${match.team2.name} </div>\
            </a>\
            <div class="results">\
            <div class="result ${match.maps[0].result.length == 0 ? `result-x` : ``}">\
            ${match.maps[0].result.length == 0 ? `Unplayed` : match.maps[0].result.split(":")[1]} </div>\
            <div class="result ${match.maps[1].result.length == 0 ? `result-x` : ``}">\
            ${match.maps[1].result.length == 0 ? `Unplayed` : match.maps[1].result.split(":")[1]} </div>\
            <div class="result ${match.maps[2].result.length == 0 ? `result-x` : ``}">\
            ${match.maps[2].result.length == 0 ? `Unplayed` : match.maps[2].result.split(":")[1]} </div>\
            </div>\
            </div>\
            </div>\
            </div>\
            </div>\
            `
            /*
            //Team 1
            copyOfTemplate.replace(/${match.team1.name}/g, match.team1.name)
            copyOfTemplate.replace(/${match.team1.countrycode}/g, match.team1.countrycode)
            copyOfTemplate.replace(/${match.team1.teamid}/g, match.team1.teamid)
            //Team 2
            copyOfTemplate.replace(/${match.team2.name}/g, match.team2.name)
            copyOfTemplate.replace(/${match.team2.countrycode}/g, match.team2.countrycode)
            copyOfTemplate.replace(/${match.team2.teamid}/g, match.team2.teamid)
            //Map Names
            copyOfTemplate.replace(/${match.maps[0].name}/g, match.maps[0].name)
            copyOfTemplate.replace(/${match.maps[1].name}/g, match.maps[1].name)
            copyOfTemplate.replace(/${match.maps[2].name}/g, match.maps[2].name)
            //Map Scores

            if (match.maps[0].result.length !== 0) {
                chrome.extension.getBackgroundPage().console.log(`
                        map 0 `)
                copyOfTemplate.replace("MAP1_TEAM1", match.maps[0].result.split(":")[0])
                copyOfTemplate.replace("MAP1_TEAM2", match.maps[0].result.split(":")[1])
            } else {
                chrome.extension.getBackgroundPage().console.log(`
                        map 01 `)
                copyOfTemplate.replace("MAP1_TEAM1", `
                        Unplayed `)
                copyOfTemplate.replace("MAP1_TEAM2", `
                        Unplayed `)
            }
            if (match.maps[1].result !== "") {
                copyOfTemplate.replace("MAP2_TEAM1", match.maps[1].result.split(":")[0])
                copyOfTemplate.replace(/MAP2_TEAM2/g, match.maps[1].result.split(":")[1])
            } else {
                copyOfTemplate.replace(/MAP2_TEAM1/g, `
                        Unplayed `)
                copyOfTemplate.replace(/MAP2_TEAM2/g, `
                        Unplayed `)
            }
            if (match.maps[2].result !== "") {
                copyOfTemplate.replace(/MAP3_TEAM1/g, match.maps[2].result.split(":")[0])
                copyOfTemplate.replace(/MAP3_TEAM2/g, match.maps[2].result.split(":")[1])
            } else {
                copyOfTemplate.replace(/MAP3_TEAM1/g, `
                        Unplayed `)
                copyOfTemplate.replace(/MAP3_TEAM2/g, `
                        Unplayed `)
            }
*/

            

            templates.push(template)
            if (data.length - 1 == i) {
                //Last run through - lets make the visuals - this compiles all in one go.
                body.innerHTML = `
                        `;
                for (let v = 0; v < templates.length; v++) {
                    body.innerHTML += templates[v]
                }
            }

        }
    });
}