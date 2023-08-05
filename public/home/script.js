async function main() {
  let errCount = 0;
  if(errCount < 10){
    try {
      const data = await fetch(`${window.location.href}api`, {
        method: "POST",
        body: JSON.stringify({ token: "auth" }),
        headers: {
          "Content-Type": "application/json"
        }
      })
      .then(response => response.json())
      .catch(error => {
        console.error(error);
      });
      return data;
    } catch(err) {
      errCount++;
      console.log(err);
    }
  } else {
    console.log("API ERROR");
  }
}

async function displayStats(){
  const data = await main();
  const uptime = document.getElementById("uptime");
  const cpu = document.getElementById("cpu");
  const ram = document.getElementById("ram");

  uptime.innerText = `${data.uptime.days}d ${data.uptime.hours}h ${data.uptime.minutes}m ${data.uptime.seconds}s `;
  cpu.innerText = `${data.cpu.percentage}%`;
  ram.innerText = `${data.ram.freeMemory}/${data.ram.totalMemory}GB (${((data.ram.freeMemory / data.ram.totalMemory) * 100).toFixed(2)}%)`;
}

displayStats();
setInterval(displayStats, 1000);
