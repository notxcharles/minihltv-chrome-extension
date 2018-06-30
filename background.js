const {
    HLTV
} = require(`hltv`)
const countryCodes = require(`./countryCodes.json`)
// const fs = require(`fs`)
const trackedLiveMatches = [] //This array contains all of the matches that we are currently following.
const loggedMatches = [] //This array contains all the ids of live matches

getLiveMatches();
setInterval(getLiveMatches, 60000)

chrome.extension.onConnect.addListener(port => {
    console.log(`Extension has been opened.`)
    port.postMessage(trackedLiveMatches)
    setInterval(function () {
        if (!port) return; //This might stop the loop when extension is closed?
        port.postMessage(trackedLiveMatches)
        console.log(`SENDINGSENDING!`)
        console.log(`LoggedM: ${loggedMatches}`)
    }, 10000)
})

function getLiveMatches() {
    console.log(`livem = ${JSON.stringify(trackedLiveMatches)}`)
    HLTV.getMatches()
        .then((matches) => {
            for (let i = 0; i < matches.length; i++) {
                if (matches[i].live) {

                    if (loggedMatches.indexOf(matches[i].id) == -1) {
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
                        loggedMatches.push(matches[i].id)
                        console.log(loggedMatches)

                    } else {
                        //Live match is already being tracked
                        console.log(`b`)
                    }

                }
                if (i == matches.length - 1) {
                    console.log(`final loop`)
                    //Final loop, get extra info.
                    getLiveMatchInfo();
                    checkLoggedMatches();
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
                        oneMap.result = ""
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
    // if (teamid == trackedLiveMatches[i][`team${teamnumber}`].teamid) console.log(`cool`)
    // else console.log(`nicht`)
    const matchObj = trackedLiveMatches[i]
    HLTV.getTeam({
            id: teamid
        })
        .then((ateam) => {
            matchObj.team1.logo = ateam.logo
            //We need to convert the location to a country code.
            for (let v = 0; v < countryCodes.length; v++) {
                if (countryCodes[v].name.toLowerCase() == ateam.location.toLowerCase()) {
                    matchObj[`team${teamnumber}`].countrycode = countryCodes[v].code
                    break; //No need to keep looking for a match if we found one.
                }
            }
        })
        .catch(err => {
            console.error(err)
        })
}

function checkLoggedMatches() {
    console.log(`check logged matches!`)
    //To check if all our logged matches are live we will use HLTV.getmatch to check
    for (let i = 0; i < trackedLiveMatches.length; i++) {
        let matchObj = trackedLiveMatches[i]
        HLTV.getMatch({
                id: matchObj.matchid
            })
            .then((match) => {
                if (match.live == true) {
                    console.log(`---${matchObj.matchid} LIVE!!!!`)
                } else {
                    console.log(`---${matchObj.matchid} NOT LIVE!!!!`)
                    //Match isn't live!
                    let v = trackedLiveMatches.indexOf(matchObj);
                    trackedLiveMatches.splice(v, 1);
                    //Remove the match from the array.
                    //Now we need to remove the match from the array of match ids
                    let index = loggedMatches.indexOf(matchObj.matchid);
                    if (index > -1) loggedMatches.splice(index, 1);
                }
            })
    }
}

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
                    if (matchObj.maps[v].name == shortMapName) {
                        currentMap = v;
                        const ctTeam = sb.ctTeamName;
                        const tTeam = sb.terroristTeamName;
                        const ctScore = sb.ctTeamScore;
                        const tScore = sb.tTeamScore;
                        //console.log(`${ctTeam}: ${ctScore} | ${tTeam}: ${tScore}`) This spams console
                        if (ctTeam == matchObj.team1.teamname) {
                            let formattedScore = `${ctScore}:${tScore}`

                            matchObj.maps[currentMap].result = formattedScore
                        } else {
                            let formattedScore = `${tScore}:${ctScore}`
                            matchObj.maps[currentMap].result = formattedScore
                        }
                        break;
                    }
                }

            }
        })
    }

}