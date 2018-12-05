const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');
var Promise = require('bluebird');
var readFilePromise = Promise.promisify(fs.readFile);

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
    if (err) {
      callback (err);
    } 
    let allTodos = _.map(todos, (todo) => {
      let id = path.basename(todo, '.txt');
      let filePath = path.join(exports.dataDir, todo);
      return readFilePromise(filePath)
        .then((todo) => { 
          return {id: id, text: todo.toString()};
        });
    });
    Promise.all(allTodos).then((allTodos) => { callback(null, allTodos); });
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
      callback(null, obj);
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
          // console.log('in write error', id)
          callback(err);
        } else {
          callback(null, text);
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
