let paused = false;

let logs = [];

const API = "";


async function update(){

    try{

        let response = await fetch(API + "/logs");

        logs = await response.json();


        displayLogs();


        document.getElementById("status").innerHTML =
        "Online";


    }

    catch(error){

        document.getElementById("status").innerHTML =
        "Offline";

    }


}


async function resetServerInfo() {
    await fetch("/reset-server", {
        method: "POST"
    });

    alert("Server info reset!");
    location.reload();
}


function displayLogs(){

    let box = document.getElementById("logs");

    let oldScroll =
    box.scrollTop;


    box.innerHTML="";


    logs.forEach(log=>{


        let type = log.type.toLowerCase();


        let css="";


        if(type.includes("chat"))
            css="chat";

        else if(type.includes("message"))
            css="message";

        else if(type.includes("hint"))
            css="hint";

        else if(type.includes("join"))
            css="join";

        else if(type.includes("leave"))
            css="leave";



        box.innerHTML += `

        <div class="log ${css}">

        <div class="time">
        ${log.timestamp || ""}
        </div>


        <b>${log.type}</b>


        <br>


        ${log.player ? 
        "Player: "+log.player+"<br>" : ""}


        ${log.message || ""}


        </div>

        `;


    });



    if(!paused){

        box.scrollTop = box.scrollHeight;

    }

    else{

        box.scrollTop = oldScroll;

    }


}




async function clearLogs(){

    await fetch("/clear",{

        method:"POST"

    });


    update();

}



function togglePause(){

    paused=!paused;


    event.target.innerHTML =
    paused ? 
    "resume scroll" :
    "pause scroll";

}



function copyLogs(){

    let text = logs.map(log=>{

        return `[${log.type}] ${log.player || ""}: ${log.message || ""}`;

    }).join("\n");


    navigator.clipboard.writeText(text);

}



function downloadLogs(){

    let text = JSON.stringify(
        logs,
        null,
        2
    );


    let blob =
    new Blob(
        [text],
        {type:"application/json"}
    );


    let url =
    URL.createObjectURL(blob);


    let a=document.createElement("a");

    a.href=url;

    a.download="roblox_logs.json";

    a.click();

}



async function updateInfo(){

    try{

        let res =
        await fetch("/info");


        let info =
        await res.json();


        document.getElementById("serverInfo").innerHTML = `

        JobId: ${info.jobId}<br>

        Players: ${info.players}/${info.maxPlayers}<br>

        PlaceId: ${info.placeId}<br>

        Started: ${info.started}

        `;


    }

    catch{}

}



setInterval(update,2000);

setInterval(updateInfo,5000);


update();

updateInfo();
