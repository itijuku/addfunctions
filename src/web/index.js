let allSetting = ["button1","button2","button3","button4","button5","button6","button7","button8"];
let allList = ["list1","list2","list3","list4","list5","list6","list7","list8"];
let customDisp = {
    "list1":`
    履歴をリアルタイムで監視し、迅速に削除します。<br>
    <div class="credit">
        クレジット:<a href="https://github.com/itijuku">@itijuku</a>
    </div>
    `,

    "list2":`
    最後に開いてから、既定値以上の時間が経過したタブをリアルタイムで監視し、削除します。<br>
    <div class="localsetting">
        <label for="_local_deleteTabTime">既定値を入力(※単位:分)</label>
        <input type="number" id="_local_deleteTabTime" step="1">
    </div><br>
    <div class="credit">
        クレジット:<a href="https://github.com/itijuku">@itijuku</a>
    </div>
    `,

    "list3":`
    多くのサイトのコピー規制を解除します。<br>
    <div class="credit">
        クレジット:<a href="https://github.com/itijuku">@itijuku</a>
    </div>
    `,

    "list4":`
    「control + Q」で快適なクイック検索を行えます。<br>
    <div class="credit">
        クレジット:<a href="https://github.com/itijuku">@itijuku</a>
    </div>
    `,

    "list5":`
    様々な広告をブロックし、快適なネットサーフィンを実現します。<br>
    ※現在、youtube広告のスキップボタンは手動で押す必要があります。<br>
    <div class="credit">
        クレジット:<a href="https://github.com/itijuku">@itijuku</a>
    </div>
    `,

    "list6":`
    「s」キーで現在表示されている動画をスキップします。
    <div class="credit">
        クレジット:<a href="https://github.com/itijuku">@itijuku</a>
    </div>
    `,

    "list7":`
    ティンカーキャドに様々な機能を追加します。<br>
    <b>【主な機能】</b><br>
    ・input要素に四則演算機能を追加します。<br>
    ・「その他のシェイプ」を自動的に押します。<br>

    ※この機能は動作が重くなる可能性があります<br>
    <div class="credit">
        クレジット:<a href="https://github.com/itijuku">@itijuku</a>
    </div>
    `,

    "list8":`
    開発者ツールが無効化されているサイトでも通常のショートカットキーで使用できるようにします。<br>
    <div class="credit">
        クレジット:<a href="https://github.com/itijuku">@itijuku</a>
    </div>
    `,
};

let opentab = {};
for(const option of allList){
    opentab[option] = false;
}

chrome.storage.local.get(["localsetting"], (d) => {
    if(!d.localsetting){
        chrome.storage.local.set({
            "localsetting":{"_local_deleteTabTime":60}
        });
    }
});

chrome.storage.local.get(["setting"], (d) => {
    let settingData = d.setting;
    if(!settingData){
        settingData = {};
        for(const option of allSetting){
            settingData[option] = {"enabled":false};
        }
    }else{
        for(const option of allSetting){
            if(!(option in settingData)){
                settingData[option] = {"enabled":false};
            }
        }
    }

    for(const option of allSetting){
        const localbutton = document.getElementById(option);
        console.log(settingData[option])
        if([true,false].includes(settingData[option]["enabled"])){
            localbutton.checked = settingData[option]["enabled"];
        }else{
            localbutton.checked = false;
            settingData[option]["enabled"] = false;
        }

        localbutton.addEventListener("change",()=>{
            settingData[localbutton.id]["enabled"] = localbutton.checked;
            chrome.storage.local.set({
                "setting":settingData
            })
        });
    }

    for(const option of allList){
        const locallist = document.querySelector(`.${option}`);
        locallist.addEventListener("click",(event)=>{
            if(event.target.tagName !== "INPUT"){
                if(opentab[option]){
                    opentab[option] = false;
                    let basehtml = document.getElementById(option);
                    basehtml.innerHTML = "";
                }else{
                    opentab[option] = true;
                    let basehtml = document.getElementById(option);
                    basehtml.innerHTML = customDisp[option];

                    if(option === "list2"){
                        const inputdata = document.getElementById("_local_deleteTabTime");
                        chrome.storage.local.get(["localsetting"], (d) => {
                            if(d.localsetting?._local_deleteTabTime){
                                inputdata.value = d.localsetting._local_deleteTabTime;
                            }
                            inputdata.addEventListener("input",()=>{
                                if(inputdata.value.length > 5){
                                   inputdata.value = inputdata.value.slice(0,5);
                                }

                                const deletetime = Number(inputdata.value);
                                if(!isNaN(deletetime)){
                                    const newd = d["localsetting"] || {};
                                    newd["_local_deleteTabTime"] = deletetime;
                                    chrome.storage.local.set({
                                        "localsetting":newd
                                    });
                                }
                            });
                        });
                    }
                }
            }
        });
    }
})

// const queryinput = document.querySelector("#queryInput");
// queryinput.addEventListener("change",()=>{
//     console.log(queryinput.value);
// });