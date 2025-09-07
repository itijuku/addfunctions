console.log("startstartstartstartstartstartstartstartstartstartstartstartstartstartstartstart")

const url = window.location.href;

const cookie = document.cookie.split(";");
getData = {};

for(const d of cookie){
    const localData = d.split("=");
    getData[localData[0].trim()] = localData[1];
}

const csrftoken = getData["scratchcsrftoken"];

function parser(str){
    let string = str.replace(/\s+/g,"");
    const numbers = [0,1,2,3,4,5,6,7,8,9,".","-"];

    while(["*","/","+","%"].filter(d=>string.includes(d)).length || string.slice(1).includes("-")){
        // console.log(string,["*","/","+","%"].filter(d=>string.includes(d)).length,string.slice(1).includes("-"))
        let nowIndex = 0;
        let best = [nowIndex,"",true];
        let startEndIndex = [NaN,NaN];

        let i = 0;
        for(const char of string){
            if(char === "("){
                nowIndex++;
                startEndIndex[0] = i;
                if(best[0] < nowIndex || best[0] === nowIndex){
                    best = [nowIndex,"",true];
                }
            }else if(char === ")" && best[2]){
                nowIndex--;
                startEndIndex[1] = i;
                best[2] = false;
            }else if(best[2]){
                best[1] += char;
            }
            i++;
        }
        if(isNaN(startEndIndex[0]))startEndIndex[0] = 0;
        if(isNaN(startEndIndex[1]))startEndIndex[1] = string.length - 1;

        let data = Array.from(best[1]);

        while(["*","/","+","%"].filter(d=>data.includes(d)).length || data.slice(1).includes("-")){
            for(let index=0;index<data.length;index++){
                value = data[index];
                if(["*","/","%"].includes(value) || 
                (!(data.includes("*") || data.includes("/") || data.includes("%")) && (["+"].includes(value)
                 || (0 < index && ["-"].includes(value))))){

                    let leftNumber = ["",NaN];
                    let i = -1;
                    while(!(numbers.map(String).includes(data[index + i]))){
                        i--;
                    }
                    while((numbers.map(String).includes(data[index + i]))){
                        leftNumber[0] = `${data[index + i]}${leftNumber[0]}`;
                        i--;
                    }leftNumber[1] = index + i + 1;

                    let rightNumber = ["",NaN];
                    i = 1;
                    while(!(numbers.map(String).includes(data[index + i]))){
                        i++;
                    }
                    while((numbers.map(String).includes(data[index + i]))){
                        rightNumber[0] = `${rightNumber[0]}${data[index + i]}`;
                        i++;
                    }rightNumber[1] = index + i - 1;

                    const lastData = data;

                    data = lastData.slice(0,leftNumber[1]);

                    switch(value){
                        case "*":
                            data.push(...Array.from(String(Number(leftNumber[0]) * Number(rightNumber[0]))));
                            break;
                        case "/":
                            data.push(...Array.from(String(Number(leftNumber[0]) / Number(rightNumber[0]))));
                            break;
                        case "+":
                            data.push(...Array.from(String(Number(leftNumber[0]) + Number(rightNumber[0]))));
                            break;
                        case "-":
                            data.push(...Array.from(String(Number(leftNumber[0]) - Number(rightNumber[0]))));
                            break;
                        case "%":
                            data.push(...Array.from(String(Number(leftNumber[0]) % Number(rightNumber[0]))));
                            break;
                    }

                    data.push(...lastData.slice(rightNumber[1]+1));

                    // console.log("data",data)
                    break;
                }
            }
        }

        const lastString = string;
        let addData = "";
        data.map(d=>{addData+=d});
        
        string = lastString.slice(0,startEndIndex[0]) + addData + lastString.slice(startEndIndex[1] + 1)
    }

    return Number(string);
}

if(url.includes("https://scratch.mit.edu/login")){
    let data = {username: "", password: "", useMessages: true};
    chrome.storage.local.get(["username","password"], (d) => {
        console.log("log",d.username)
        if(d.username && d.password){
            data.username = d.username;
            data.password = d.password;
            fetch('https://scratch.mit.edu/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-csrftoken': csrftoken,
                    'x-requested-with': 'XMLHttpRequest'
                },
                body: JSON.stringify(data)
            })
            .then(res => res.json())
            .then(result => {
                if(result[0]["success"]){
                    window.open("https://scratch.mit.edu/","_self");
                    console.log("成功");
                }else{
                    window.alert("自動ログインに失敗しました");
                    console.log("失敗");
                }
            })
            .catch(err => console.error(err));
        }
    });

}if(url.includes("https://scratch.mit.edu/explore")
     || url.includes("https://scratch.mit.edu/search/projects")){
    const myinput = document.createElement("input");
    myinput.id = "_input";
    myinput.style.width = "20px";
    const mylabel = document.createElement("label");
    mylabel.htmlFor = "_input";
    mylabel.textContent = "読み込む";
    const mybutton = document.createElement("button");
    mybutton.textContent = "決定";

    const container = document.createElement("div");
    container.style.position = "fixed";
    container.style.background = "white";
    container.style.padding = "3px";
    container.style.border = "1px solid #000";
    container.style.zIndex = "9999";
    container.style.display = "flex";
    container.style.gap = "3px";
    container.style.alignItems = "center";
    container.style.fontSize = "12px"
    container.style.cursor = "default";
    
    let offsetX = 0;
    let offsetY = 0;
    container.style.left = "3px";
    container.style.top = "3px";

    let isNowMove = false;
    
    container.addEventListener("mousedown",(e)=>{
        offsetX = e.clientX - Number(container.style.left.split("px")[0]);
        offsetY = e.clientY - Number(container.style.top.split("px")[0]);
        isNowMove = true;
        container.style.cursor = "grabbing";
    });
    document.addEventListener("mouseup",(e)=>{
        isNowMove = false;
        container.style.cursor = "default";
    });
    document.addEventListener("mousemove",(e)=>{
        if(isNowMove){
            container.style.left = `${e.clientX - offsetX}px`;
            container.style.top = `${e.clientY - offsetY}px`;
        }
    });

    const closeButton = document.createElement("button");
    closeButton.textContent = "×";
    closeButton.style.fontSize = "20px";
    closeButton.style.background = "transparent";
    closeButton.style.border = "none";

    closeButton.addEventListener("click",(e)=>{
        container.remove();
    });


    container.appendChild(mylabel);
    container.appendChild(myinput);
    container.appendChild(mybutton);
    container.appendChild(closeButton);

    document.body.prepend(container);

    mybutton.onclick = () =>{
        const inputtag = document.querySelector("#_input");
        for(let i = 0;i<Math.floor(inputtag.value);i++){
            setTimeout(() => {
                const button = document.querySelector("#view")
                .querySelector(".button");
                console.log("buttoninfo:",button);
                button.click();
            },i*300);
        }
    }
}if(url.includes("https://scratch.mit.edu/explore/projects")
     || url.includes("https://scratch.mit.edu/search/projects")){
    const projects = document.querySelector(".flex-row").querySelectorAll(".thumbnail-title");
    for(const p of projects){
        let localurl = p.querySelector("a").href.split("/");
        localurl = localurl[localurl.length - 2]
        fetch(`https://api.scratch.mit.edu/projects/${localurl}`)
        .then(res=>res.json())
        .then(data=>{
            if(data.code === "NotFound"){
                p.querySelector("a").textContent = "削除された作品";
                p.querySelector("a").style.color = "red";
            }
        });
    }
}if(url.includes("https://scratch.mit.edu/projects/")){
    for(let i=0;i<10;i++){
        setTimeout(() => {
            const comments = document.querySelector(".flex-row.comments-list").querySelectorAll(".comment-content");

            for(const c of comments){
                const textcontent = c.querySelectorAll("a");
                if(textcontent.length > 0 && textcontent[0].href.includes("https://scratch.mit.edu/projects/")){
                    c.style.fontSize = "10px";
                }else{
                    const textcontent2 = Array.from(c.querySelectorAll("span"));
                    if(textcontent2.filter(text=>text.textContent.includes("https://scratch.mit.edu/projects/")).length > 0){
                        c.style.fontSize = "10px";
                    }
                }
            }
        },i*250);
    }
}

chrome.storage.local.get(["setting"], (d) => {
    if(d["setting"] && d["setting"]["button3"]["enabled"]){
        if(document.readyState === "loading"){
            document.addEventListener("DOMContentLoaded",()=>{
                toCanSelect();
            });
        }else{
            toCanSelect();
        }

        function toCanSelect(){
            ["copy","cut","paste","selectstart","contextmenu","mousedown","mouseup","keydown"]
            .forEach(ev => {
                document.addEventListener(ev, e => {
                    e.stopPropagation();
                }, true);
            });

            for(const value of Array.from(document.querySelectorAll("*"))){
                const v = "text";
                value.style.setProperty("user-select",v,"important");
                value.style.setProperty("webkitUserSelect",v,"important");
                value.style.setProperty("MozUserSelect",v,"important");
                value.style.setProperty("msUserSelect",v,"important");
            }
        }
    }

    if(d["setting"] && d["setting"]["button4"]["enabled"]){
        let downkeys = new Set();

        document.addEventListener("keydown",(e)=>{
            downkeys.add(e.key.toLowerCase());
            if(downkeys.has("control") && downkeys.has("q")){
                downkeys = new Set();
                if(!window.getSelection().toString()){
                    const activeEl = document.activeElement;
                    if(activeEl && (activeEl.tagName === "INPUT" || activeEl.tagName === "TEXTAREA")){
                        activeEl.value += "意味 読み 英語の場合カタカナ発音";
                    }
                }else{
                    window.open(`https://www.google.com/search?q=${window.getSelection().toString() + " 意味 読み 英語の場合カタカナ発音"}`);
                }
            }
        });

        document.addEventListener("keyup",(e)=>{
            downkeys.delete(e.key.toLowerCase());
        });
    }

    if(d["setting"] && d["setting"]["button5"]["enabled"]){
        if(url.includes("youtube.com") && url.includes("watch?v=")){

            const video = document.querySelector("video");

            setInterval(function(){
                const skipbutton = document.querySelector(".ytp-skip-ad-button");
                const skipbutton2 = document.querySelector(".ytp-skip-ad-button ytp-ad-component--clickable");
                const skipbutton3 = document.querySelector(".ytp-skip-ad-button.ytp-ad-component--clickable");
                for(const skipbtn of [skipbutton,skipbutton2,skipbutton3]){
                    if(skipbtn){
                        skipbtn.click();
                        skipbtn.dispatchEvent(new MouseEvent("click", {
                            bubbles: true, cancelable: true, view: window,
                        }))
                    }
                }

            },500)

            const observer = new MutationObserver(mutations =>{
                for (const m of mutations){
                    m.addedNodes.forEach(node => {
                        if (node.nodeType === Node.ELEMENT_NODE){
                            const isAd = document.querySelector(".ytp-ad-player-overlay-layout__player-card-container");
                            const isAd2 = document.querySelector(".ytp-ad-player-overlay-layout__ad-info-container");
                            const isAd3 = document.querySelector(".ytp-ad-player-overlay-layout__player-card-container");
                            
                            if(isAd !== undefined || isAd2 !== undefined || isAd3 !== undefined){
                                isAd.remove();
                                isAd2.remove();
                                isAd3.remove();
                                video.currentTime = video.duration;
                            }
                        }
                    });
                }
            });

            observer.observe(document.body, { childList: true, subtree: true });
        }else{
            const adlsit = [
                "ftAd","adLogic","popup-origin","googlesyndication","cm-ad-playe","cm-os","cm-communication","ad-rectangle",
                "google_ads","googleads","adform","data-google-av-adk","AdBanner","inmobi-ad-container","videoAd","imasdk.googleapis",
                "geniee","adFor","popup_area","ad_video","bnc_ad","bance","adid","ytd-ad"
            ];

            if(document.readyState === "loading"){
                document.addEventListener("DOMContentLoaded",()=>{
                    removeAd();
                });
            }else{
                removeAd();
            }

            const video = document.querySelector("video");

            function checkDom(dom){
                for(const att of dom.attributes){
                    const ads = adlsit.filter(adward=>(att.name.includes(adward) || att.value.includes(adward)));
                    if(ads.length > 0){
                        if(dom.isConnected){
                            dom.remove();
                        }
                        break;
                    }
                }
            }

            function removeAd(){
                // console.log("DOM loaded");
                const doms = Array.from(document.querySelectorAll("*"));
                for(const dom of doms){
                    checkDom(dom);
                }

                const observer = new MutationObserver(mutations =>{
                    for (const m of mutations){
                        m.addedNodes.forEach(node => {
                            if (node.nodeType === Node.ELEMENT_NODE){
                                checkDom(node);
                                node.querySelectorAll("*").forEach(el =>{
                                    checkDom(el);
                                });
                            }
                        });
                    }
                });

                observer.observe(document.body, { childList: true, subtree: true });
            }
        }
    }

    if(d["setting"] && d["setting"]["button6"]["enabled"]){
        const video = document.querySelector("video");
        document.addEventListener("keydown",(event) => {
            if(event.key.toLowerCase() === "s"){
                video.currentTime = video.duration;
            }
        });
    }

    if(d["setting"] && d["setting"]["button7"]["enabled"]){
        setInterval(function(){
            const classData = document.querySelector(".dimension-label-view.visible");
            if(classData){
                const input = classData.querySelector("input");
                if(input){
                    input.addEventListener("change",()=>{
                        console.log("change",parser(input.value));
                        input.value = parser(input.value);
                    },true);
                }
            }

            const buttonData = document.querySelector(".button.button--size--standard.button--type--primary.button--float--inherit.button--rounded");
            
            if(buttonData){
                buttonData.click();
            }
        },250);
    }
    if(d["setting"] && d["setting"]["button8"]["enabled"]){
        document.addEventListener("keydown",(e)=>{
            e.stopImmediatePropagation();
        },true);
    }
});

