import logo from "./logo.svg";
import "./App.css";
import Loader from "./components/Loader/Loader";
import { lazy, Suspense, useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import NotFound from "./pages/404";
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));

function App() {
  const [nav, setNav] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [state, setState] = useState(true);

  useEffect(() => {
    if (localStorage.getItem("Token") != null) {
      setLoggedIn(JSON.parse(localStorage.getItem("Token")));
      setUser(JSON.parse(localStorage.getItem("user")));
      window.scrollTo(0, 0);
      let customer = JSON.parse(localStorage.getItem("user"));
      let customer_id = customer?._id;
    } else {
      setLoggedIn(false);
    }
  }, [state]);

  return (
    <Suspense fallback={<Loader />}>
      <Router>
        <Routes>
          {/* <Route path="/" element={<Home />} /> */}
          <Route
            path="/"
            element={
              <Login state={state} setState={setState} setNav={setNav} />
            }
          />
          <Route path="/register" element={<Register setNav={setNav} />} />
          <Route path="/*" element={<NotFound />} />
        </Routes>
      </Router>
    </Suspense>
  );
}

export default App;
