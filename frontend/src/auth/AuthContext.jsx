import React, { createContext, useContext, useState } from "react";

// Create a React context object with null value
// Contains authentication information
const AuthContext = createContext(null);

// Export this function to be used as elsewhere
export function AuthProvider({ children }) {
  // Auth state (currently logged in user)
  // user = current user
  // setUser == updates user
  // null == no one logged in by default
  const [user, setUser] = useState(null);
  // Provides all child components (pages) to use
  // user and setUser
  // Important for authentication (login) and logout
  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

// Helper function to be called from outside
export function useAuth() {
  return useContext(AuthContext);
}