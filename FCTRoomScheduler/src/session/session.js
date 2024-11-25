// session.js
import Users from '../storage/users.json';

// Function to set user session
export const setUserSession = (user) => {
    const nextId = Users.users.length + 1;
    const token = Math.random().toString(36).substr(10);
    const createUser = {
        "id": `${nextId}`,
        "username": `${user.username}`,
        "name": `${user.name}`,
        "email": `${user.email}`,
        "password": `${user.password}`,
        "token": `${token}`
    }
    Users.users.push(createUser);
    localStorage.setItem('userSessionToken', token);
};

export const login = (username, password) => {
    const user = Users.users.find(user => user.username === username && user.password === password);
    if (user) {
        localStorage.setItem('userSessionToken', user.token);
        return true;
    }
    return false;
};

// Function to get user session
export const getUserToken = () => {
    return localStorage.getItem('userSessionToken');
};

export const getUser = () => {
    const token = getUserToken();
    const user = Users.users.find(user => user.token === token);
    return user ? user : null;
}

export const userExists = (username, email) => {
    return Users.users.some(user => user.username === username || user.email === email);
}

// Function to clear user session
export const clearUserSession = () => {
    localStorage.removeItem('userSessionToken');
};

// Function to check if user is logged in
export const isLoggedIn = () => {
    const token = getUserToken();
    if (Users.users.find(user => user.token === token)) {
        return true;
    } else return false;
};

export const deleteUser = (token) => {
    const index = Users.users.findIndex(user => user.token === token);
    Users.users.splice(index, 1);
    clearUserSession();
}