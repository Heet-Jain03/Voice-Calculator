// auth.js

// Function to check if a user is authenticated
function checkAuth() {
    const sessionUser = sessionStorage.getItem('sessionUser');
    return !!sessionUser; 
}

// Function to log in a user
function login(username, password) {
    const users = JSON.parse(localStorage.getItem('users')) || {};

    // Validate username and password
    if (users[username] && users[username].password === password) {
        sessionStorage.setItem('sessionUser', username); // Set the session user
        return true; // Login successful
    }
    return false; // Login failed
}

// Function to register a new user
function register(username, email, password) {
    const users = JSON.parse(localStorage.getItem('users')) || {};

    // Check for existing username and email
    const usernameExists = users[username] !== undefined;
    const emailExists = Object.values(users).some(user => user.email === email);

    if (usernameExists || emailExists) {
        return false; // Registration failed due to existing user
    }

    // Create a new user
    users[username] = { email: email, password: password };
    localStorage.setItem('users', JSON.stringify(users)); // Save to localStorage
    return true; // Registration successful
}

// Function to log out the user
function logout() {
    sessionStorage.removeItem('sessionUser'); // Clear session
    window.location.href = 'index.html';  // Redirect to the login page
}

// Check authentication on page load for protected routes
if (window.location.pathname.endsWith('home.html')) {
    if (!checkAuth()) {
        window.location.href = 'index.html';  // Redirect to the login page if not logged in
    }
}
