const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
const {
  borrowBook,
  returnBook,
  viewHistory,
  deleteAccount,
  getAllBooks,
} = require("../controllers/memberController");

const router = express.Router();

router.route("/").get(getAllBooks);
router.route("/borrow/bookId").put(borrowBook);
router.route("/return/bookId").put(returnBook);
router.route("/delete").delete(deleteAccount);
router.route("/history").get(viewHistory);

module.exports = router;
