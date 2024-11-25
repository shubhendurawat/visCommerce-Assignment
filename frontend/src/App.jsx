import Login from "./login/Login.jsx"
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { Route, Routes } from "react-router-dom";
import Register from "./register/Register.jsx";
import Home from "./home/home.jsx";
import { UserVerify } from "./utils/UserVerify.jsx";

function App() {

  return (
    <>
      <div className="p-2 w-screen h-screen flex items-center justify-center">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<UserVerify />}>
            <Route path="/" element={<Home />} />
          </Route>
        </Routes>
        <ToastContainer />
      </div>
    </>
  )
}

export default App
