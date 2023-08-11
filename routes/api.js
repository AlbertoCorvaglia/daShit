const os = require('os');
const express = require('express');
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
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
      percentage: Math.ceil(cpuPercentage),
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
      osUptime: os.uptime()
    },
  };
}

router.get("/", async (req, res) => {
  handleRequest(req, res);
});

router.post("/", async (req, res) => {
  handleRequest(req, res);
});

async function handleRequest(req, res) {
  const token = req.cookies.token;
  const secret = process.env.JWT_SECRET; // or any other method to retrieve the secret
  try {
    const decoded = jwt.verify(token, secret);
    const statistics = await sendStat();
    console.log(statistics);
    res.json({ ...statistics });
  } catch (err) {
    if (token == process.env.AUTH_TOKEN) {
      const statistics = await sendStat();
      console.log(statistics);
      res.json({ ...statistics });
    } else {
      console.log(`Auth Token: ${process.env.AUTH_TOKEN}`);
      if (err.name == "JsonWebTokenError") {
        console.error("Cookie Not set");
      } else {
        console.error(err.name);
      }
      res.status(401).send("Unauthorized");
    }
  }
}

module.exports = router;


module.exports = router;