import { Routes, Route, Navigate } from "react-router-dom";
import TestApi from "./components/TestApi.jsx";
import "./App.css";

export default function App() {
  return (
    <Routes>
      {/* Send the home page straight to /test_api */}
      <Route path="/" element={<Navigate to="/test_api" replace />} />
      <Route path="/test_api" element={<TestApi />} />
    </Routes>
  );
}
