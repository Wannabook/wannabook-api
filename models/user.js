const fs = require('fs');
const path = require('path');
const uuidv4 = require('uuid/v4');

const createDirIfNotExist = () => {
  const dir = './tmp';

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
};

const addUser = userData => {
  createDirIfNotExist();
  const currentUsers = readUsers();
  const updatedUsers = currentUsers ? [...currentUsers, userData] : [userData];
  const dataJSON = JSON.stringify(updatedUsers, null, 2);
  fs.writeFileSync(path.join(__dirname, '/../tmp', 'users.json'), dataJSON);
};

const saveUsers = users => {
  createDirIfNotExist();
  const dataJSON = JSON.stringify(users, null, 2);
  fs.writeFileSync(path.join(__dirname, '/../tmp', 'users.json'), dataJSON);
};

const readUsers = () => {
  try {
    const dataBuffer = fs.readFileSync(
      path.join(__dirname, '/../tmp', 'users.json')
    );
    const dataJSON = dataBuffer.toString();

    return JSON.parse(dataJSON);
  } catch (e) {
    return [];
  }
};

class User {
  constructor(props) {
    const { name, email, password } = props;
    this.id = uuidv4();
    this.name = name;
    this.email = email;
    this.password = password;
  }
}

class UserModel {
  constructor() {}
  static getUsers() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() > 0.9) {
          return reject('Something went wrong...');
        }
        const users = readUsers();
        resolve(users);
      }, 700);
    });
  }

  static getUsersById(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() > 0.9) {
          return reject('Something went wrong...');
        }
        const users = readUsers();
        const user = users.find(user => user.id === id);
        if (!user) reject('User not found');
        resolve(user);
      }, 700);
    });
  }

  static save(userData) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() > 0.9) {
          return reject('Something went wrong...');
        }
        const user = new User(userData);
        addUser(user);
        resolve(user);
      }, 700);
    });
  }

  static delete(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() > 0.9) {
          return reject('Something went wrong...');
        }

        const users = readUsers();
        const userToDelete = users.find(user => user.id === id);
        const index = users.indexOf(userToDelete);
        if (index > -1) {
          users.splice(index, 1);
          saveUsers(users);
          resolve(userToDelete);
        }
        reject('User not found');
      }, 700);
    });
  }
}

module.exports = { UserModel };
