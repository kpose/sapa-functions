const { db } = require("../utils/admin");

exports.getAllWallets = (req, res) => {
  db.collection("wallets")
    .orderBy("createdAt", "desc")
    .get()
    .then((data) => {
      let wallets = [];
      data.forEach((doc) => {
        wallets.push({
          postId: doc.id,
          title: doc.data().title,
          income: doc.data().income,
          expenses: doc.data().expenses,
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
    income: {},
    expenses: {},
    createdAt: new Date().toISOString(),
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

exports.deleteWallet = (request, response) => {
  const document = db.doc(`/wallets/${request.params.walletId}`);
  document
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return response.status(404).json({ error: "Wallet not found" });
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
