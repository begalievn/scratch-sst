import { useState, useEffect } from "react";
import Navbar from "react-bootstrap/Navbar";
import Routes from "./Routes.tsx";
import Nav from "react-bootstrap/Nav";
import { Link } from "react-router-dom";
import { AppContext, AppContextType } from "./lib/contextLib";
import { Auth } from "aws-amplify";
import { useNavigate } from "react-router-dom";
import { onError } from "./lib/errorLib";
import "./App.css";

function App() {
  const nav = useNavigate();
  const [isAuthenticated, userHasAuthenticated] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(true);

  useEffect(() => {
    onLoad();
  }, []);
  
  async function onLoad() {
    try {
      await Auth.currentSession();
      userHasAuthenticated(true);
    } catch (e) {
      if (e !== "No current user") {
        onError(e);
      }
    }
  
    setIsAuthenticating(false);
  }

  async function handleLogout() {
    await Auth.signOut();
  
    userHasAuthenticated(false);
  
    nav("/login");
  }

  return (
    !isAuthenticating && <div className="App container py-3">
    <Navbar collapseOnSelect bg="light" expand="md" className="mb-3 px-3">
      <Link to="/">
        <Navbar.Brand className="fw-bold text-muted">Scratch</Navbar.Brand>
      </Link>
      <Navbar.Toggle />
      <Navbar.Collapse className="justify-content-end">
        <Nav activeKey={window.location.pathname}>
          {
            isAuthenticated ? (
              <>
                <Link to="/settings">Settings</Link>
                <Link to="" onClick={handleLogout}>Logout</Link>
              </>
            ) : (
              <>
                <Link to="/signup">Signup</Link>
                <Link to="/login">Login</Link>
              </>
            )
          }
        </Nav>
      </Navbar.Collapse>
    </Navbar>
    <AppContext.Provider
      value={{ isAuthenticated, userHasAuthenticated } as AppContextType}
    >
      <Routes />
    </AppContext.Provider>
  </div>
  );
}

export default App;
