import "./App.css";
import Footer from "./components/footer";
import Home from "./components/home";
import SignIn from "./components/signin";
import { ToastContainer } from "react-toastify";
import SignUp from "./components/signup";
import "react-toastify/dist/ReactToastify.css";
import { Route, Routes } from "react-router-dom";
import Navbar from "./components/navbar";
import SignOut from "./components/signout";
import Users from "./components/users";
import ProtectedRoute from "./components/common/protectedRoute";
import EditUser from "./components/editUser";
import DeleteUser from "./components/deleteUser";
import AddFriend from "./components/addFriend";
import DeleteFriend from "./components/deleteFriend";
import ChatApp from "./components/chat";

function App() {
  return (
    <div className="App d-flex flex-column min-vh-100">
      <ToastContainer />
      <header>
        <Navbar />
      </header>
      <main className="flex-fill container">
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route path="signin" element={<SignIn />} />
          <Route path="signup" element={<SignUp redirect="/signin" />} />
          <Route path="signout" element={<SignOut redirect="/" />} />
          <Route
            path="users/edit/:id"
            element={
              <ProtectedRoute adminOnly>
                <EditUser />
              </ProtectedRoute>
            }
          />
          <Route
            path="users/delete/:id"
            element={
              <ProtectedRoute adminOnly>
                <DeleteUser />
              </ProtectedRoute>
            }
          />
          <Route
            path="users/friends/add/:id"
            element={
              <ProtectedRoute>
                <AddFriend adminOnly />
              </ProtectedRoute>
            }
          />
          <Route
            path="users/friends/remove/:id"
            element={
              <ProtectedRoute>
                <DeleteFriend adminOnly />
              </ProtectedRoute>
            }
          />
          <Route path="chat" element={<ChatApp />} />
        </Routes>
      </main>
      <footer>
        <Footer />
      </footer>
    </div>
  );
}

export default App;
