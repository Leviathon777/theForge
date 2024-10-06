import { createContext, useContext, useState, useEffect } from 'react';
import { getUser } from '../firebase/services'; // Ensure this function is working correctly

const UserContext = createContext();

export const useUser = () => {
  return useContext(UserContext);
};

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user on component mount
  useEffect(() => {
    const userId = "exampleUserId"; // Replace this with actual user ID logic
    fetchUser(userId);
  }, []);

  const fetchUser = async (userId) => {
    try {
      const user = await getUser(userId);
      setCurrentUser(user);
    } catch (error) {
      console.error('Error fetching user:', error);
    } finally {
      setLoading(false); // Ensure loading is set to false no matter what
    }
  };

  const value = {
    currentUser,
    fetchUser,
  };

  return (
    <UserContext.Provider value={value}>
      {/* Provide a loading indicator until the data is fetched */}
      {loading ? <p>Loading...</p> : children}
    </UserContext.Provider>
  );
};
