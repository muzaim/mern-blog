const express = require("express");
const app = express();

app.use(() => {
  console.log(`hello`);
  console.log(`selamat pagi`);
});

app.listen(5000);
