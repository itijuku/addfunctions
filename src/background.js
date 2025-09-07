chrome.history.onVisited.addListener((historyItem) => {
    chrome.storage.local.get(["setting"], (d) => {
        if(d["setting"] && d["setting"]["button1"]["enabled"]){
            chrome.history.deleteUrl({"url":historyItem.url});
        }
        if(d["setting"] && d["setting"]["button2"]["enabled"]){
            chrome.storage.local.get(["localsetting"], (d) => {
                let deletetime = 0;
                if("_local_deleteTabTime" in d["localsetting"]){
                    deletetime = d["localsetting"]["_local_deleteTabTime"];
                }else{
                    deletetime = 60;
                }

                chrome.tabs.query({}, (tabs) => {
                    const datas = tabs.filter(tab=>(Date.now() - tab.lastAccessed)/1000/60> deletetime).map(tab=>tab.id);
                    chrome.tabs.remove(datas);
                });
            });
        }
    });
});

// chrome.runtime.onInstalled.addListener(async () => {
//     chrome.tabs.create({
//         url:"chrome-extension://ampaehaioeeedlhjbfohgmpogmdfgibd/web/index.html"
//     })
// });