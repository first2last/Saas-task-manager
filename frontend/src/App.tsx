import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { PrivateRoute } from './components/PrivateRoute';
import { NotesPage } from './pages/NotesPage';

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <PrivateRoute>
          <NotesPage />
        </PrivateRoute>
      </div>
    </AuthProvider>
  );
}

export default App;
