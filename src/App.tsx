import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import ShoppingList from './pages/ShoppingList';
import Expenses from './pages/Expenses';
import Events from './pages/Events';
import Tasks from './pages/Tasks';
import Achievements from './pages/Achievements';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/shopping" element={<ShoppingList />} />
          <Route path="/expenses" element={<Expenses />} />
          <Route path="/events" element={<Events />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/achievements" element={<Achievements />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
