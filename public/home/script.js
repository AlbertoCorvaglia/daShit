async function main() {
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
    console.log(err);
  }
}

let errCount = 0;

async function displayStats() {
  if (errCount < 10) {
    const data = await main();
    if (!data) {
      errCount++;
    } else {
      errCount = 0;

      const uptime = document.getElementById("uptime");
      const cpu = document.getElementById("cpu");
      const ram = document.getElementById("ram");

      // Calculate and display uptime
      const uptimeInSeconds = data.uptime.osUptime;
      const days = Math.floor(uptimeInSeconds / 86400);
      const hours = Math.floor(uptimeInSeconds / 3600) % 24;
      const minutes = Math.floor(uptimeInSeconds / 60) % 60;
      const seconds = Math.floor(uptimeInSeconds % 60);
      uptime.innerText = `${days}d ${hours}h ${minutes}m ${seconds}s`;

      // Display CPU and RAM information
      cpu.innerText = `${data.cpu.percentage}%`;
      ram.innerText = `${data.ram.freeMemory}/${data.ram.totalMemory}GB (${((data.ram.freeMemory / data.ram.totalMemory) * 100).toFixed(2)}%)`;
    }
  } else {
    console.log("API ERROR");
  }

  requestAnimationFrame(displayStats);
}

displayStats();
