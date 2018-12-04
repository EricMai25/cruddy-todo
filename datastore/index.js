const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, count) => {
    if (err) {
      throw (err);
    } else {
      fs.writeFile(`${exports.dataDir}/${count}.txt`, text, () => {
        let todo = { id: count, text: text};
        callback(err, todo);
      });
    }
  });
};

exports.readAll = (callback) => {
  fs.readdir(exports.dataDir, (err, todos) => {
    todoList = [];
    
    _.each(todos, (id) => {
      todoList.push({ 'id': id.substring(0, 5), 'text': id.substring(0, 5) });
    });
  
    callback(err, todoList);
  });
};

exports.readOne = (id, callback) => {
  fs.readFile(`${exports.dataDir}/${id}.txt`, (err, todo) => {
    if (err) {
      callback(err);
    } else {
      let obj = {
        id: id,
        text: todo.toString()
      };
      callback(err, obj);
    }
  });
};

exports.update = (id, text, callback) => {
  fs.readFile(`${exports.dataDir}/${id}.txt`, (err, fileData) => {
    if (err) {
      callback(err);
    } else {
      fs.writeFile(`${exports.dataDir}/${id}.txt`, text, (err) => {
        if (err) {
          callback(err);
        } else {
          callback(err, text);
        }
      });
    }
  });
};

exports.delete = (id, callback) => {
  fs.readFile(`${exports.dataDir}/${id}.txt`, (err, fileData) => {
    if (err) {
      callback(err);
    } else {
      fs.unlink(`${exports.dataDir}/${id}.txt`, (err) => {
        callback(err);
      });
    }
  });
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
