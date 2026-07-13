async function update(){

    const res = await fetch("/logs");

    const logs = await res.json();

    const consoleDiv = document.getElementById("console");

    consoleDiv.textContent = logs.join("\n");

    consoleDiv.scrollTop = consoleDiv.scrollHeight;

}

document.getElementById("clear").onclick = async () => {

    if(!confirm("clear all logs?"))
        return;

    await fetch("/clear",{
        method:"POST"
    });

    update();

};

setInterval(update,1000);

update();
