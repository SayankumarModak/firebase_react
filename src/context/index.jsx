import { createContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import auth from "../firebaseConfig";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext(null);

export default function AuthState({ children }) {
  const [registerFormData, setRegisterFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loginFormData, setLoginFormData] = useState({
    email: "",
    password: "",
  });
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  function registerWithFirebase() {
    setLoading(true);
    const { email, password } = registerFormData;
    // firebase gives a method 
    return createUserWithEmailAndPassword(auth, email, password);
  }

  function loginWithFirebase() {
    setLoading(true);
    const { email, password } = loginFormData;

    return signInWithEmailAndPassword(auth, email, password);
  }

  function handleLogout() {
    return signOut(auth);
  }

  useEffect(() => {
    // to store the auth i mean the current user as if we refresh we can know thate  we have already registered and should not haee to d0 it again
    const checkAuthState = onAuthStateChanged(auth, (currentUser) => {
      console.log(currentUser, "currentUser");
      setUser(currentUser);
      setLoading(false);
    });
// have to unsubscribe
    return () => {
      checkAuthState();
    };
  }, []);

  useEffect(() => {
    if (user) navigate("/profile");
  }, [user]);

  if (loading) return <h1>Loading ! Please wait</h1>;

  return (
    <AuthContext.Provider
      value={{
        registerFormData,
        setRegisterFormData,
        registerWithFirebase,
        loading,
        user,
        loginFormData,
        setLoginFormData,
        loginWithFirebase,
        handleLogout,
        setUser,
        setLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
