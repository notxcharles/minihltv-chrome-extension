const {
    HLTV
} = require(`hltv`)
const fs = require(`fs`)
const trackedLiveMatches = [] //This array contains all of the matches that we are currently following.
const liveMatches = [] //This array contains all the ids of live matches

/*
chrome.extension.onConnect.addListener(port => {
    console.log(`Extension has been opened.`)
    port.onMessage.addListener(msg => {
        console.log(`Message From Ext - ${msg}`)
        port.postMessage(`Hey There!`)
    })
    getLiveMatches();
})
*/
getLiveMatches();
setInterval(getLiveMatches, 10000)

function getLiveMatches() {
    console.log(`livem`)
    HLTV.getMatches()
        .then((matches) => {
            for (let i = 0; i < matches.length; i++) {
                if (matches[i].live) {
                    if (liveMatches.indexOf(matches[i].id) == -1) {
                        //The live match isnt already added.
                        console.log(`a`)
                        const liveMatch = matches[i]
                        const matchObj = {
                            matchid: liveMatch.id,
                            team1: {
                                name: liveMatch.team1.name,
                                teamid: liveMatch.team1.id
                            },
                            team2: {
                                name: liveMatch.team2.name,
                                teamid: liveMatch.team2.id
                            },
                            eventName: liveMatch.event.name,
                            format: liveMatch.format,
                            maps: liveMatch.maps
                        }
                        trackedLiveMatches.push(matchObj) //Add all the live matches objects into one array.
                        //console.log(matchObj)
                        getTeamInfo(matchObj.team1.teamid, i, 1);
                        getTeamInfo(matchObj.team2.teamid, i, 2);
                        scoreBot();
                        liveMatches.push(matches[i].id)
                        console.log(liveMatches)
                        if (matches.length - 1 == i) {
                            //Final loop, get extra info.
                            getLiveMatchInfo();
                        }
                    } else {
                        //Live match is already being tracked
                        console.log(`b`)
                    }

                }

            }
        })
}

function getLiveMatchInfo() {
    console.log(`getLiveM called`)
    for (let i = 0; i < trackedLiveMatches.length; i++) {
        let matchObj = trackedLiveMatches[i]
        HLTV.getMatch({
                id: matchObj.matchid
            })
            .then((match) => {
                //chrome.extension.getBackgroundPage().console.log(`1`)
                matchObj.maps = match.maps;
                //This contains the score for each map.

                //We need to go through each score and reformat
                //Current format: "16:14 (5:10; 11:4)STATS"
                //Format needed:  "16:14"

                for (let i = 0; i < matchObj.maps.length; i++) {
                    let oneMap = matchObj.maps[i]
                    if (oneMap.result == "") {
                        //Match hasn't finished.
                    } else {
                        //Match has finished
                        oneMap.result = oneMap.result.split(" ")[0]
                    }
                }
            })
    }
}

function getTeamInfo(teamid, i, teamnumber) {
    console.log(`getTeamI called`)
    if (teamid == trackedLiveMatches[i][`team${teamnumber}`].teamid) console.log(`cool`)
    else console.log(`nicht`)
    HLTV.getTeam({
            id: teamid
        })
        .then((res) => {

        })
        .catch(err => {
            console.error(err)
        })
}

setInterval(() => {
    //console.log(`matches - ${JSON.stringify(trackedLiveMatches)}`)
    /*
    for (let i = 0; i < trackedLiveMatches.length; i++) {
        let match = trackedLiveMatches[i]
        //Lets replace the abrieviated map names with full name
        for (let v = 0; v < match.maps.length; v++) {
            switch (match.maps[v].name) {
                case "inf":
                    match.maps[v].name = "Inferno";
                    break;
                case "trn":
                    match.maps[v].name = "Train";
                    break;
                case "cch":
                    match.maps[v].name = "Cache";
                    break;
            }
        }
    }
    */
    fs.writeFile(`./test_jsons/hltv/abcd.json`, JSON.stringify(trackedLiveMatches), `utf8`, () => {})
}, 1000)

function scoreBot() {
    for (let i = 0; i < trackedLiveMatches.length; i++) {
        let matchObj = trackedLiveMatches[i];
        HLTV.connectToScorebot({
            id: matchObj.matchid,
            onScoreboardUpdate: (sb) => {
                let map = sb.mapName
                let shortMapName;
                switch (map) {
                    case "de_inferno":
                        shortMapName = "inf"
                        break;
                    case "de_train":
                        shortMapName = "trn"
                        break;
                    case "de_cache":
                        shortMapName = "cch"
                        break;
                    case "de_inferno":
                        shortMapName = "inf"
                        break;
                    case "de_mirage":
                        shortMapName = "mrg";
                        break;
                    case "de_dust2":
                        shortMapName = "d2";
                        break;
                    case "de_nuke":
                        shortMapName = "nuke";
                        break;
                    case "de_overpass":
                        shortMapName = "ovp";
                        break;
                }
                let currentMap;
                for (let v = 0; v < matchObj.maps.length; v++) {
                    if (matchObj.maps[v].name.toLowerCase() == shortMapName.toLowerCase()) {
                        currentMap = v;
                        break;
                    }
                }
                let ctTeam = sb.ctTeamName;
                let tTeam = sb.terroristTeamName;
                let ctScore = sb.ctTeamScore;
                let tScore = sb.tTeamScore;
                console.log(`${ctTeam}: ${ctScore} | ${tTeam}: ${tScore}`)
                if (ctTeam == matchObj.team1.teamname) {
                    let formattedScore = `${ctScore}:${tScore}`

                    matchObj.maps[currentMap].result = formattedScore
                } else {
                    let formattedScore = `${tScore}:${ctScore}`
                    matchObj.maps[currentMap].result = formattedScore
                }
            }
        })
    }

}