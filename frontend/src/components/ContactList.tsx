import { useEffect, useState } from 'react';
import { contactAPI, Contact } from '../lib/api';
import { Trash2, Mail, Phone, MessageSquare } from 'lucide-react';

interface ContactListProps {
  refreshTrigger: number;
}

export default function ContactList({ refreshTrigger }: ContactListProps) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await contactAPI.getContacts();
      setContacts(data || []);
    } catch (err) {
      setError('Failed to load contacts');
      console.error('Error fetching contacts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, [refreshTrigger]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this contact?')) {
      return;
    }

    setDeletingId(id);

    try {
      await contactAPI.deleteContact(id);
      setContacts(prev => prev.filter(contact => contact._id !== id));
    } catch (err) {
      alert('Failed to delete contact');
      console.error('Error deleting contact:', err);
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Contact List</h2>
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Contact List</h2>
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Contact List</h2>
        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
          {contacts.length} {contacts.length === 1 ? 'Contact' : 'Contacts'}
        </span>
      </div>

      {contacts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No contacts yet. Add your first contact above!</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Name</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Phone</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Message</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((contact) => (
                <tr
                  key={contact._id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="py-4 px-4">
                    <div className="font-medium text-gray-900">{contact.name}</div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center text-gray-700">
                      <Mail size={16} className="mr-2 text-gray-400" />
                      <a href={`mailto:${contact.email}`} className="hover:text-blue-600">
                        {contact.email}
                      </a>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center text-gray-700">
                      <Phone size={16} className="mr-2 text-gray-400" />
                      <a href={`tel:${contact.phone}`} className="hover:text-blue-600">
                        {contact.phone}
                      </a>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    {contact.message ? (
                      <div className="flex items-start text-gray-700 max-w-xs">
                        <MessageSquare size={16} className="mr-2 text-gray-400 flex-shrink-0 mt-1" />
                        <span className="line-clamp-2">{contact.message}</span>
                      </div>
                    ) : (
                      <span className="text-gray-400 italic">No message</span>
                    )}
                  </td>
                  <td className="py-4 px-4 text-gray-600 text-sm">
                    {formatDate(contact.createdAt)}
                  </td>
                  <td className="py-4 px-4 text-center">
                    <button
                      onClick={() => handleDelete(contact._id)}
                      disabled={deletingId === contact._id}
                      className="inline-flex items-center justify-center p-2 rounded-md text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Delete contact"
                    >
                      {deletingId === contact._id ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-600"></div>
                      ) : (
                        <Trash2 size={18} />
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
