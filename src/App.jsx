import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import Login from "./Pages/Auth/Login";
import Dashboard from "./Pages/Dashboard/Dashboard";
import LoginSuccess from "./Pages/Auth/LoginSuccess";
import Attachments from "./Pages/Attachments/Attachments";
import Messages from "./Pages/Messages/Messages";
import AttachmentView from "./Features/FeatureAttachments/AttachmentView";
import Nav from "./Components/Header/Nav";

const App = () => {
  const location = useLocation();
  return (
    <>
      {location.pathname !== "/login" && <Nav />}
      <div
        className={`w-full relative object-cover ${
          location.pathname !== "/login" ? "mt-[9rem]" : ""
        } bg-white`}
      >
        <Routes>
          <Route path="/" element={<Navigate to={"/login"} />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/loginsuccess" element={<LoginSuccess />}></Route>
          <Route path="/dashboard" element={<Dashboard />}></Route>
          <Route path="/attachments" element={<Attachments />}></Route>
          <Route path="/messages" element={<Messages />}></Route>
          <Route path="/attachments" element={<Attachments />} />
          <Route path="/attachments/:title" element={<AttachmentView />} />
        </Routes>
      </div>
    </>
  );
};

export default () => (
  <BrowserRouter basename="/outlook_mail_loader">
    <App />
  </BrowserRouter>
);
