const functions = require("firebase-functions");
const app = require("express")();
const firebase = require("firebase");

const { getAllWallets } = require("./api/wallets");

app.get("/wallets", getAllWallets);

exports.api = functions.https.onRequest(app);
