import logo from './logo.svg';
import './App.css';
import Login from "./components/Login";
import Register from './components/Register';
import {BrowserRouter, Route, Routes} from "react-router-dom";

function App() {
  return (
<BrowserRouter>
        <Routes>
            {/* <Route path="/" element={<Layout />}> */}
                {/* <Route index element={<Calculator />} /> */}
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
                {/* <Route path="players" element={players} /> */}
            {/* </Route> */}
        </Routes>
    </BrowserRouter>
  );
}

export default App;
