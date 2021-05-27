const functions = require("firebase-functions");
const app = require("express")();
const auth = require("./utils/auth");
const firebase = require("firebase");

/* wallet apis */
const {
  getAllWallets,
  createWallet,
  deleteWallet,
  editWallet,
} = require("./api/wallets");

/* user  apis */
const {
  loginUser,
  signUpUser,
  uploadProfilePhoto,
  getUserDetail,
  updateUserDetails,
} = require("./api/users");

/* wallet routes */
app.get("/wallets", auth, getAllWallets);
app.post("/createwallet", auth, createWallet);
app.delete("/deletewallet/:walletId", auth, deleteWallet);
app.put("/wallet/:walletId", auth, editWallet);

/* user routes */
app.post("/login", loginUser);
app.post("/signup", signUpUser);
app.post("/user/image", auth, uploadProfilePhoto);
app.get("/user", auth, getUserDetail);
app.post("/user", auth, updateUserDetails);

exports.api = functions.https.onRequest(app);
