const {
    HLTV
} = require(`hltv`)
const countryCodes = require(`./countrycodes.json`)
//const xyz = document.getElementById(`test`)
// const body = document.getElementById(`body`)
const liveMatches = []
//This will be an array containing objects that will hold info about each team and match currently playing.
let html = ``;
window.onload = function () {
    chrome.extension.getBackgroundPage().console.log(`Chrome extension has been loaded.`)
    // body.innerHTML = `Chrome extension opened!`

    HLTV.getMatches() //Get a list of the current matches on hltv.org/matches
        .then((matches) => {
            for (let i = 0; i < matches.length; i++) {
                if (matches[i].live) {

                    let liveMatch = matches[i]
                    let matchObj = {
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
                    liveMatches.push(matchObj) //Add all the live matches objects into one array.

                }
            }
            //Now that we have a list of the live matches, we have to get more info about the teams.
            for (let i = 0; i < liveMatches.length; i++) {
                let matchObj = liveMatches[i]
                /*
                    prepare to enter callback hell

                    For every live match, search up each team and get some data.
                    -> HLTV Logo link
                    -> Their country name, look up the country name in a json and find a country code.
                */
                HLTV.getMatch({
                        id: matchObj.matchid
                    })
                    .then((match) => {
                        chrome.extension.getBackgroundPage().console.log(`1`)
                        matchObj.maps = match.maps;
                        //This contains the score for each map.

                        HLTV.getTeam({
                                id: matchObj.team1.teamid
                            })
                            .then((teamA) => {
                                matchObj.team1.logo = teamA.logo
                                //We need to convert the location to a country code.
                                for (let v = 0; v < countryCodes.length; v++) {
                                    if (countryCodes[v].name.toLowerCase() == teamA.location.toLowerCase()) {
                                        matchObj.team1.countrycode = countryCodes[v].code
                                        break; //No need to keep looking for a match if we found one.
                                    }
                                }

                                HLTV.getTeam({
                                        id: matchObj.team2.teamid
                                    })
                                    .then((teamB) => {
                                        matchObj.team2.logo = teamB.logo
                                        //We need to convert the location to a country code.
                                        for (let v = 0; v < countryCodes.length; v++) {
                                            if (countryCodes[v].name.toLowerCase() == teamB.location.toLowerCase()) {
                                                matchObj.team2.countrycode = countryCodes[v].code
                                                break; //No need to keep looking for a match if we found one.
                                            }
                                        }

                                        //Add all the existing information to the extension for now.
                                        //xyz.innerHTML = JSON.stringify(liveMatches);
                                        //body.innerHTML += `<div class="match-preview">${JSON.stringify(matchObj)}</div>`
                                    })

                            })
                        // .catch((err) => { chrome.extension.getBackgroundPage().console.log(`${err}`) })
                        // We could use .catch here, but when we don't use it we can just skip the team's country code being added,
                        // bit of a bodge job but it'll do for now.
                    })
                    .catch((err) => {
                        chrome.extension.getBackgroundPage().console.log(err)
                    })


            }
        })


}
/*
    basic method
    
    Get list of matches,
    Find which matches are live,
    GetMatch for each
        -Get Team for team 1 and team 2
        
*/