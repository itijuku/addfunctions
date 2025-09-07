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

const str = "170.0-5";

console.log(parser(str));