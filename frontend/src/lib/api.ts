const API_BASE_URL = 'https://contact-app-o05v.onrender.com/api';

export interface Contact {
  _id: string;
  name: string;
  email: string;
  phone: string;
  message?: string;
  createdAt?: string;
}

export interface AddContactPayload {
  name: string;
  email: string;
  phone: string;
  message?: string;
}

export const contactAPI = {
  async getContacts(): Promise<Contact[]> {
    const response = await fetch(`${API_BASE_URL}/contacts`);
    if (!response.ok) throw new Error('Failed to fetch contacts');
    return response.json();
  },

  async addContact(contact: AddContactPayload): Promise<Contact> {
    const response = await fetch(`${API_BASE_URL}/contacts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(contact),
    });
    if (!response.ok) throw new Error('Failed to add contact');
    return response.json();
  },

  async deleteContact(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/contacts/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete contact');
  },
};
