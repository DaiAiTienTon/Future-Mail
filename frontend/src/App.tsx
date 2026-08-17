import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import CreateEmail from './pages/CreateEmail';
import EmailDetail from './pages/EmailDetail';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="create" element={<CreateEmail />} />
          <Route path="emails/:id" element={<EmailDetail />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
