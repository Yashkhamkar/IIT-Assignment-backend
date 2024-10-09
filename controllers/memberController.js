const asyncHandler = require("express-async-handler");
const Book = require("../models/bookModel");
const Transaction = require("../models/transactionModel");
const User = require("../models/userModel");

const borrowBook = asyncHandler(async (req, res) => {
  try {
    const { bookId } = req.params;
    const book = await Book.findById(bookId);
    if (!book) {
      res.status(404);
      throw new Error("Book not found");
    }
    if (book.status === "BORROWED") {
      res.status(400);
      throw new Error("Book is not available");
    }
    book.status = "BORROWED";
    book.borrowedBy = req.user._id;
    await book.save();

    await Transaction.create({
      member: req.user._id,
      book: bookId,
      type: "BORROWED",
    });
    return res.status(200).json({
      message: "Book borrowed successfully",
    });
  } catch (error) {
    res.status(400);
    throw new Error("Error: " + error);
  }
});

const returnBook = asyncHandler(async (req, res) => {
  try {
    const { bookId } = req.params;
    const book = await Book.findById(bookId);
    if (!book) {
      res.status(404);
      throw new Error("Book not found");
    }
    if (book.status === "AVAILABLE") {
      res.status(400);
      throw new Error("Book is already available");
    }
    if (book.borrowedBy.toString() !== req.user._id.toString()) {
      res.status(400);
      throw new Error("Book is not borrowed by you");
    }
    book.status = "AVAILABLE";
    book.borrowedBy = null;
    await book.save();

    await Transaction.create({
      member: req.user._id,
      book: bookId,
      type: "RETURNED",
    });
    return res.status(200).json({
      message: "Book returned successfully",
    });
  } catch (error) {
    res.status(400);
    throw new Error("Error: " + error);
  }
});

const getAllBooks = asyncHandler(async (req, res) => {
  try {
    const books = await Book.find({});
    return res.status(200).json(books);
  } catch (error) {
    res.status(400);
    throw new Error("Error: " + error);
  }
});

const viewHistory = asyncHandler(async (req, res) => {
  try {
    const member = await Transaction.find({ member: req.user._id }).populate(
      "book"
    );
    if (member) {
      return member;
    } else {
      res.status(404);
      throw new Error("Member not found");
    }
  } catch (error) {
    res.status(400);
    throw new Error("Error: " + error);
  }
});

const deleteAccount = asyncHandler(async (req, res) => {
  try {
    const member = await User.findById(req.user._id);
    const password = req.body.pass;

    if (member && (await user.matchPassword(pass))) {
      member.status = "DELETED";
      await member.save();
      return res.status(200).json({
        message: "Account deleted successfully",
      });
    } else {
      res.status(404);
      throw new Error("Password is incorrect");
    }
  } catch (error) {
    res.status(400);
    throw new Error("Error: " + error);
  }
});

module.exports = {
  borrowBook,
  returnBook,
  viewHistory,
  deleteAccount,
  getAllBooks,
};
