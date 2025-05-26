export function isAuthenticated() {
  return new Promise((resolve) => {
    // Check if token exists in localStorage
    const token = localStorage.getItem('token');
    
    if (!token) {
      resolve(false);
      return;
    }
    
    // If you want to validate the token, you could do additional checks here
    // For example, check if it's expired or make a request to the server to validate it
    // For simplicity, we'll just check if it exists
    resolve(true);
  });
} 