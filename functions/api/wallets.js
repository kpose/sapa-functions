const { db } = require("../utils/admin");

exports.getAllWallets = (req, res) => {
  db.collection("wallets")
    //.orderBy("createdAt", "desc")
    .get()
    .then((data) => {
      let wallets = [];
      data.forEach((doc) => {
        wallets.push({
          postId: doc.id,
          title: doc.data().title,
          income: doc.data().income,
          expenses: doc.data().expenses,
        });
      });
      return res.json(wallets);
    })
    .catch((err) => console.log(err));
};
