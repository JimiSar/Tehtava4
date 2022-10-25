const exp = require("constants");
const express = require("express");
const fs = require("fs");
const app = express();
const port = 3000;

let sanakirja = [];

let data = fs.readFileSync("./sanakirja.txt", { encoding: "utf8", flag: "r" });

const splitLines = data.split(/\r?\n/);

splitLines.forEach((line) => {
  const sanat = line.split(" ");
  //console.log(sanat);
  const sana = {
    fin: sanat[0],
    eng: sanat[1],
  };
  //console.log(sana);
  sanakirja.push(sana);
});
console.log(sanakirja);

//console.log(splitLines);

app.use(express.json()); //Käytetään json muotoa
app.use(express.urlencoded({ extended: true })); //Käytetään tiedonsiirrossa laajennettua muotoa

//CORS asetukset
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, Accept, Content-Type, X-Requested-With, X-CSRF-Token"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Content-type", "application/json");
  next();
});

app.get("/sanakirja", (req, res) => {
  res.json(sanakirja); //Palautetaan sanakirja taulukko json muodossa
});

app.post("/sanakirja", (req, res) => {
  //Jos postitetaan json muodossa lisättävä data
  //console.log(req.body);
  const sanapari = req.body;
  //Lisätään sanapari sanakirjaan
  sanakirja.push(sanapari);
  console.log(sanakirja);
  //Kirjoitetaan tiedostoon sanakirja.txt uusi lisättävä tietue (sanapari)

  try {
    data += `\n${sanapari.fin} ${sanapari.eng}`;
    fs.writeFileSync("./sanakirja.txt", data);
    return res.status(201).json(sanapari);
  } catch (error) {
    //virheen sattuessa
    console.log(error);
    return res.status(500).json(err);
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
