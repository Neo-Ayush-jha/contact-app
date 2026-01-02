import { useState } from 'react';
import ContactForm from './components/ContactForm';
import ContactList from './components/ContactList';
import { Users } from 'lucide-react';

function App() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleContactAdded = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Users className="text-blue-600 mr-3" size={48} />
              <h1 className="text-4xl font-bold text-gray-900">Contact Management System</h1>
            </div>
            <p className="text-gray-600 text-lg">Manage your contacts efficiently with real-time updates</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <ContactForm onContactAdded={handleContactAdded} />
            </div>

            <div className="lg:col-span-2">
              <ContactList refreshTrigger={refreshTrigger} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
