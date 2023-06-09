import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Components
import Home from 'pages/Home';
import Profile from 'pages/Profile';
import SignIn from 'pages/SignIn';
import SignUp from 'pages/SignUp';
import ForgotPassword from 'pages/ForgotPassword';
import Offers from 'pages/Offers';
import Header from 'components/Header';
import PrivateRoute from 'components/PrivateRoute';
import CreateListing from 'pages/CreateListing';
import EditListing from 'pages/EditListing';
import Listing from 'pages/Listing';
import Category from 'pages/Category';

function App() {
  return (
    <>
      <Router>
        <Header />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/profile' element={<PrivateRoute />}>
            <Route index element={<Profile />} />
          </Route>
          <Route path='/sign-up' element={<SignUp />} />
          <Route path='/sign-in' element={<SignIn />} />
          <Route path='/forgot-password' element={<ForgotPassword />} />
          <Route path='/offers' element={<Offers />} />
          <Route path='/listings/create' element={<PrivateRoute />}>
            <Route index element={<CreateListing />} />
          </Route>
          <Route path='/listings/:listingId' element={<PrivateRoute />}>
            <Route path='edit' element={<EditListing />} />
          </Route>
          <Route path='/category/:categoryName/:listingId' element={<Listing />} />
          <Route path='/category/:categoryName' element={<Category />} />
        </Routes>
      </Router>
      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </>
  );
}

export default App;
