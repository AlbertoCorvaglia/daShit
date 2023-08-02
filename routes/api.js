const os = require('os');
const express = require('express');
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

const router = express.Router();
router.use(cookieParser());
router.use(express.static("public"));
router.use(express.urlencoded({extended: true}));
router.use(express.json());

async function getCpuPercentage() {
  function getCPUUsage() {
    const cpus = os.cpus();
    let totalIdle = 0;
    let totalTick = 0;

    cpus.forEach((core) => {
      for (type in core.times) {
        totalTick += core.times[type];
      }
      totalIdle += core.times.idle;
    });

    return { idle: totalIdle / cpus.length, total: totalTick / cpus.length };
  }

  return new Promise((resolve, reject) => {
    const start = getCPUUsage();
    setTimeout(() => {
      const end = getCPUUsage();
      const idleDifference = end.idle - start.idle;
      const totalDifference = end.total - start.total;
      const percentageCPU = 100 - Math.floor((100 * idleDifference) / totalDifference);
      resolve(percentageCPU);
    }, 1000);
  });
}

async function sendStat() {
const cpuPercentage = await getCpuPercentage();
  const uptimeInSeconds = os.uptime();
  const totalMemory = (os.totalmem() / 1e9).toFixed(2);
  return {
    cpu: {
      percentage: cpuPercentage
    },
    ram: {
      freeMemory: (os.freemem() / 1e9).toFixed(2),
      totalMemory: totalMemory
    },
    uptime: {
      days: Math.floor(uptimeInSeconds / 86400),
      hours: Math.floor(uptimeInSeconds / 3600) % 24,
      minutes: Math.floor(uptimeInSeconds / 60) % 60,
      seconds: Math.floor(uptimeInSeconds % 60),
    },
  };
}

router.get("/", async (req, res) => {
  const token = req.cookies.token;
  const secret = process.env.JWT_SECRET; // or any other method to retrieve the secret
  try {
    const decoded = jwt.verify(token, secret);
    const statistics = await sendStat();
    console.log(statistics);
    res.json({ ...statistics, user: decoded.username });
  } catch (err) {
    console.error(err);
    res.status(401).send("Unauthorized");
  }
});

router.post("/", async (req, res) => {
  const token = req.cookies.token;
  const secret = process.env.JWT_SECRET; // or any other method to retrieve the secret
  try {
    const decoded = jwt.verify(token, secret);
    const statistics = await sendStat();
    console.log(statistics);
    res.json({ ...statistics, user: decoded.username });
  } catch (err) {
    console.error(err);
    res.status(401).send("Unauthorized");
  }
});


module.exports = router;