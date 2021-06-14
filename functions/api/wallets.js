const { firestore } = require("firebase-admin");
const { db } = require("../utils/admin");

exports.getAllWallets = (req, res) => {
  db.collection("wallets")
    .where("username", "==", req.user.username)
    .orderBy("createdAt", "desc")
    .get()
    .then((data) => {
      let wallets = [];
      data.forEach((doc) => {
        wallets.push({
          walletId: doc.id,
          title: doc.data().title,
          transactions: doc.data().transactions,
          createdAt: doc.data().createdAt,
        });
      });
      return res.json(wallets);
    })
    .catch((err) => console.log(err));
};

exports.createWallet = (request, response) => {
  if (request.body.title.trim() === "") {
    return response.status(400).json({ title: "Must not be empty" });
  }

  const newWallet = {
    title: request.body.title,
    createdAt: new Date().toISOString(),
    username: request.user.username,
    transactions: [],
  };
  db.collection("wallets")
    .add(newWallet)
    .then((doc) => {
      const responseWallet = newWallet;
      responseWallet.id = doc.id;
      return response.json(responseWallet);
    })
    .catch((err) => {
      response.status(500).json({ error: "Something went wrong" });
      console.error(err);
    });
};

exports.createTransaction = (request, response) => {
  if (request.body.amount.trim() === "") {
    return response.status(400).json({ price: "Enter a valid amount" });
  }

  const newTransaction = {
    type: request.body.type,
    amount: request.body.amount,
    marchant: request.body.marchant,
    note: request.body.note,
    category: request.body.category,
    createdAt: new Date().toISOString(),
  };

  let document = db.collection("wallets").doc(`${request.params.walletId}`);

  document
    .update({
      transactions: firestore.FieldValue.arrayUnion(newTransaction),
    })
    .then(() => {
      response.json({ message: "Transaction Created successfully" });
    })
    .catch((err) => {
      response.status(500).json({ error: "Something went wrong" });
      console.error(err);
    });
};

exports.deleteWallet = (request, response) => {
  const document = db.doc(`/wallets/${request.params.walletId}`);

  document
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return response.status(404).json({ error: "Wallet not found" });
      }
      if (doc.data().username !== request.user.username) {
        return response.status(403).json({ error: "UnAuthorized" });
      }
      return document.delete();
    })
    .then(() => {
      response.json({ message: "Delete successfull" });
    })
    .catch((err) => {
      console.error(err);
      return response.status(500).json({ error: err.code });
    });
};

exports.editWallet = (request, response) => {
  if (request.body.walletId || request.body.createdAt) {
    response.status(403).json({ message: "Not allowed to edit" });
  }
  let document = db.collection("wallets").doc(`${request.params.walletId}`);
  console.log(document);
  document
    .update(request.body)
    .then(() => {
      response.json({ message: "Updated successfully" });
    })
    .catch((err) => {
      console.error(err);
      return response.status(500).json({
        error: err.code,
      });
    });
};
