async function update(){

    const res = await fetch("/logs");

    const logs = await res.json();

    document.getElementById("console").textContent =
        logs.join("\n");

}

setInterval(update,1000);

update();
