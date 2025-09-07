function clicked(){
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    chrome.storage.local.set({
        "username":username,
        "password":password
    },()=>{});
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("saveButton").addEventListener("click", clicked);
});

const link = document.getElementById("link");
link.addEventListener("click",()=>{
    window.open("chrome-extension://ampaehaioeeedlhjbfohgmpogmdfgibd/web/index.html")
});