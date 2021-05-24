const functions = require("firebase-functions");
const app = require("express")();
const firebase = require("firebase");

const {
  getAllWallets,
  createWallet,
  deleteWallet,
  editWallet,
} = require("./api/wallets");

/* wallet routes */
app.get("/wallets", getAllWallets);
app.post("/createwallet", createWallet);
app.delete("/deletewallet/:walletId", deleteWallet);
app.put("/wallet/:walletId", editWallet);

exports.api = functions.https.onRequest(app);
