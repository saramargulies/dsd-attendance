import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainPage from "./Home/MainPage";
import Nav from "./Global/Nav";
import ClassAttendance from "./Classes/ClassAttendance";
import OutingAttendance from "./Outings/OutingAttendance";
import Overview from "./Dogs/Overview";
import Footer from "./Global/Footer";
import DogDetail from "./Dogs/DogDetail";
import CreateOuting from "./Outings/CreateOuting";
import ListOutings from "./Outings/ListOutings";
import OutingDetail from "./Outings/OutingDetail";
import AddClient from "./Dogs/AddClient";
import AddDog from "./Dogs/AddDog";
import UpdateDog from "./Dogs/UpdateDog";
import Calendar from "./Calendar/Calendar";
import PrivateAttendance from "./Privates/PrivateAttendance";
import CreatePackage from "./Privates/CreatePackage";
import Login from "./Auth/Login";
import PrivateRoutes from "./Auth/Protected";
import { AuthProvider } from "./Auth/AuthContext";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Nav />
        <div className="container">
          <Routes>
            <Route element={<PrivateRoutes />}>
              <Route path="/" element={<MainPage />} />
              <Route path="overview">
                <Route index element={<Overview />} />
                <Route path=":id">
                  <Route index element={<DogDetail />}></Route>
                  <Route path="update" element={<UpdateDog />}></Route>
                </Route>
                <Route path="add-dog" element={<AddDog />}></Route>
              </Route>
              <Route path="clients" element={<AddClient />} />
              <Route path="calendar" element={<Calendar />} />
              <Route path="private-packages" element={<CreatePackage />} />
              <Route path="outings">
                <Route index element={<ListOutings />} />
                <Route path="create" element={<CreateOuting />}></Route>
                <Route path=":id" element={<OutingDetail />}></Route>
              </Route>
              <Route path="take-attendance">
                <Route index element={<ClassAttendance />}></Route>
                <Route path="class" element={<ClassAttendance />}></Route>
                <Route path="outing" element={<OutingAttendance />}></Route>
                <Route path="private" element={<PrivateAttendance />}></Route>
              </Route>
            </Route>
            <Route path="login" element={<Login />} />
          </Routes>
        </div>
        <Footer />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
