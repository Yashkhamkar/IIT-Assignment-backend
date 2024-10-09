const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
const {
  getAllMembers,
  updateMember,
  removeMember,
  viewRemovedMembers,
  viewActiveMembers,
  memberHistory,
  addBook,
  updateBook,
  removeBook,
} = require("../controllers/librarianControllers");

const router = express.Router();

router.route("/").get(protect, getAllMembers);
router.route("/:id").put(protect, updateMember);
router.route("/:id").delete(protect, removeMember);
router.route("/removed").get(protect, viewRemovedMembers);
router.route("/active").get(protect, viewActiveMembers);
router.route("/history/:id").get(protect, memberHistory);
router.route("/add").post(protect, addBook);
router.route("/update/:id").put(protect, updateBook);
router.route("/remove/:id").delete(protect, removeBook);

module.exports = router;
