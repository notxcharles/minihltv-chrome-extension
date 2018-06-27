chrome.runtime.onMessage.addListener(recievedMessage)

function recievedMessage(message, sender, sendRes){
    console.log(message.txt)
}