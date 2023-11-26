const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (username && password) {
      if (isValid(username)) { 
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "User successfully registred. Now you can login"});
      } else {
        return res.status(404).json({message: "User already exists!"});    
      }
    } 
    return res.status(404).json({message: "Unable to register user. Username or password not provided!"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    let myPromise = new Promise((resolve,reject) => {
        resolve(JSON.stringify(books,null,4));
    });
    myPromise.then((successMessage) => {
        return res.send(successMessage)
    });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    let promise = new Promise((resolve,reject) => {
        const isbn = req.params.isbn;
        resolve(JSON.stringify(books[isbn]));
    });
    promise.then((successMessage) => {
        return res.send(successMessage);
    });
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    let promise = new Promise((resolve, reject) => {
        const author = req.params.author;
        let books_by_author = [];
        var keys = Object.keys(books);
        keys.forEach(key => {
            let book = books[key];
            if (book.author === author) {
                books_by_author.push(book);
            }
        });
        resolve(JSON.stringify(books_by_author));
    });
    promise.then((msg) => {
        return res.send(msg);
    });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    let promise = new Promise((resolve,reject) => {
        const title = req.params.title;
        var keys = Object.keys(books);
        keys.forEach(key => {
            let book = books[key];
            if (book.title === title) {
                resolve(JSON.stringify(book));
            }
        });
        resolve("No book found.");
    });

    promise.then(msg => {
        return res.send(msg);
    });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  return res.send(JSON.stringify(books[isbn].reviews));
});

module.exports.general = public_users;
