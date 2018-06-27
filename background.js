chrome.browserAction.onClicked.addListener(buttonClicked)

function buttonClicked(tab){
    let message = {
        txt: "hello"
    }
    chrome.tabs.sendMessage(tab.id, message) //Send a message to the current tab
    console.log(`button clicked.`)
}