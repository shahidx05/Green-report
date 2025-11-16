import { useContext } from 'react';
import AuthContext from '../context/AuthContext.jsx'; // Use .jsx extension

/*
  This is a custom hook.
  Instead of importing `useContext` and `AuthContext` in every file,
  we can just call `const auth = useAuth()` to get all our auth info!
*/
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};