import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";

 import UploadPage from "./pages/Upload";
 import MyDocuments from "./pages/Mydocuments";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
       
<Route path="/mydocuments" element={<MyDocuments />} />

        <Route path="/upload" element={<UploadPage />} />
       
      </Routes>
    </BrowserRouter>
  );
}

export default App;