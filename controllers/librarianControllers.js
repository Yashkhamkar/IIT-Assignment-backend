const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const Book = require("../models/bookModel");

const getAllMembers = asyncHandler(async (req, res) => {
  try {
    const members = await User.find({ role: "member" }).select("-pass");
    res.status(200).json(members);
  } catch (error) {
    res.status(400);
    throw new Error("Error: " + error);
  }
});

const updateMember = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { username, role } = req.body;
  const member = await User.findById(id);
  try {
    if (member) {
      member.username = username || member.username;
      member.role = role || member.role;
      await member.save();
      res.status(200).json(member);
    } else {
      res.status(404);
      throw new Error("Member not found");
    }
  } catch (error) {
    res.status(400);
    throw new Error("Error: " + error);
  }
});

const removeMember = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const member = await User.findById(id);

    if (member) {
      member.status = "DELETED";
      await member.save();
      res.status(200).json({ message: "Member removed" });
    } else {
      res.status(404);
      throw new Error("Member not found");
    }
  } catch (error) {
    res.status(400);
    throw new Error("Error: " + error);
  }
});

const viewRemovedMembers = asyncHandler(async (req, res) => {
  try {
    const members = await User.find({
      role: "member",
      status: "DELETED",
    }).select("-pass");
    res.status(200).json(members);
  } catch (error) {
    res.status(400);
    throw new Error("Error: " + error);
  }
});

const viewActiveMembers = asyncHandler(async (req, res) => {
  try {
    const members = await User.find({
      role: "member",
      status: "ACTIVE",
    }).select("-pass");
    res.status(200).json(members);
  } catch (error) {
    res.status(400);
    throw new Error("Error: " + error);
  }
});

const memberHistory = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const member = await User.findById(id).populate("history");
    if (member) {
      res.status(200).json(member.history);
    } else {
      res.status(404);
      throw new Error("Member not found");
    }
  } catch (error) {
    res.status(400);
    throw new Error("Error: " + error);
  }
});

const addBook = asyncHandler(async (req, res) => {
  const { title, author, copiesAvailable } = req.body;
  try {
    const book = await Book.create({
      title,
      author,
      copiesAvailable,
    });
    res.status(201).json(book);
  } catch (error) {
    res.status(400);
    throw new Error("Error: " + error);
  }
});

const updateBook = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, author, copiesAvailable } = req.body;
  const book = await Book.findById(id);
  try {
    if (book) {
      book.title = title || book.title;
      book.author = author || book.author;
      book.copiesAvailable = copiesAvailable || book.copiesAvailable;
      await book.save();
      res.status(200).json(book);
    } else {
      res.status(404);
      throw new Error("Book not found");
    }
  } catch (error) {
    res.status(400);
    throw new Error("Error: " + error);
  }
});

const removeBook = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findById(id);
    await book.remove();
    res.status(200).json({ message: "Book removed" });
  } catch (error) {
    res.status(400);
    throw new Error("Error: " + error);
  }
});

module.exports = {
  getAllMembers,
  updateMember,
  removeMember,
  viewRemovedMembers,
  viewActiveMembers,
  memberHistory,
  addBook,
  updateBook,
  removeBook,
};
