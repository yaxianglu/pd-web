import './App.css';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import PageCom from './front-page';
import FrontPage from './front-page';
import PearlLogin from './login';
import InvisibleBraces from './invisible-braces';
import Dashboard from './user';
import SmileTestTable from './list';
import Maintainer from './maintainer';
import Whitening from './whitening';
import Journey from './journey';
import Correction from './correction';
import About from './about';
import Join from './join';
import Upload from './upload';
import Partners from './partners';
function App() {
  return (
    <AuthProvider>
      <div className="App">
        {/* <nav>
          <Link to="/front-page">FrontPage</Link> | <Link to="/login">Login</Link>
        </nav> */}
        <Routes>
          <Route path="/" element={<FrontPage />} />
          <Route path="/front-page" element={<FrontPage />} />
          <Route path="/maintainer" element={<Maintainer />} />
          <Route path="/whitening" element={<Whitening />} />
          <Route path="/front-page-new" element={<PageCom />} />
          <Route path="/login" element={<PearlLogin />} />
          <Route path="/invisible-braces" element={<InvisibleBraces />} />
          <Route path="/user" element={<Dashboard />} />
          <Route path="/list" element={<SmileTestTable />} />
          <Route path="/journey" element={<Journey />} />
          <Route path="/correction" element={<Correction />} />
          <Route path="/about" element={<About />} />
          <Route path="/join" element={<Join />} />
          <Route path="/upload" element={<FrontPage />} />
          {/* <Route path="/upload" element={<Upload />} /> */}
          <Route path="/partners" element={
            <ProtectedRoute>
              <Partners />
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
