// const {
//     HLTV
// } = require(`hltv`)
//const xyz = document.getElementById(`test`)
const body = document.getElementById(`body2`)

let template = `<div class="match-preview" id="TEAM1NAME"><div class="team-box"><div class="team"><img src="https://static.hltv.org/images/bigflags/300x200/TEAM1COUNTRY.png" class="team-L"><div class="team-L-gradient"><a href="hltv.org/team/TEAM1ID/TEAM1NAME"><img src="https://static.hltv.org/images/team/logo/TEAM1ID" class="logo"><div class="teamname"> TEAM1NAME </div></a><div class="results-l"><div class="result result-l"> MAP1_TEAM1 </div><div class="result result-w"> MAP2_TEAM1 </div><div class="result"> MAP3_TEAM1 </div></div></div></div><div class="middle"><div class="eventdetails"><div class="starttime">21:25</div><div class="eventname">EVENT_NAME</div></div><div class="maps"><div class="result"> MAP1_NAME </div><div class="result"> MAP2_NAME </div><div class="result"> MAP3_NAME </div></div></div><div class="team"><img src="https://static.hltv.org/images/bigflags/300x200/TEAM2COUNTRY.png" class="team-R"><div class="team-R-gradient"><a href="hltv.org/team/TEAM2ID/TEAM2NAME"><img src="https://static.hltv.org/images/team/logo/TEAM2ID" class="logo"><div class="teamname"> TEAM2NAME </div></a><div class="results-r"><div class="result result-w"> MAP1_TEAM2 </div><div class="result result-l"> MAP2_TEAM2 </div> <div class="result"> MAP3_TEAM2 </div></div></div></div></div></div>`
const templates = []
window.onload = function () {
    chrome.extension.getBackgroundPage().console.log(`Chrome extension has been loaded.`)
    let port = chrome.extension.connect({
        name: "Sample Communication"
    });
    port.onMessage.addListener(function (data) {
        chrome.extension.getBackgroundPage().console.log(`Data has been recieved.`)
        body.innerHTML = ``
        for (let i = 0; i < data.length; i++){
            let match = data[i]
            let htmlPreview = template 
                //Team 1
                .replace(/TEAM1NAME/g, match.team1.name)
                .replace(/TEAM1COUNTRY/g, match.team1.countrycode)
                .replace(/TEAM1ID/g, match.team1.teamid)
                //Team 2
                .replace(/TEAM2NAME/g, match.team2.name)
                .replace(/TEAM2COUNTRY/g, match.team2.countrycode)
                .replace(/TEAM2ID/g, match.team2.teamid)
                //Map Scores
                .replace(/MAP1_TEAM1/g, match.maps[0].split(":")[0])
                .replace(/MAP2_TEAM1/g, match.maps[1].split(":")[0])
                .replace(/MAP3_TEAM1/g, match.maps[2].split(":")[0])
                .replace(/MAP1_TEAM2/g, match.maps[0].split(":")[1])
                .replace(/MAP2_TEAM2/g, match.maps[1].split(":")[1])
                .replace(/MAP3_TEAM2/g, match.maps[2].split(":")[1])
                //Map Names
                .replace(/MAP1_NAME/g, match.maps[0].name)
                .replace(/MAP2_NAME/g, match.maps[1].name)
                .replace(/MAP3_NAME/g, match.maps[2].name)
            templates.push(htmlPreview)
            if (data.length - 1 == i){
                //Last run through - lets make the visuals - this compiles all in one go.
                body.innerHTML = ``;
                for (let v = 0; v < templates.length; v++){
                    body.innerHTML += templates[v]
                }
            }
            
        }
    });
}
