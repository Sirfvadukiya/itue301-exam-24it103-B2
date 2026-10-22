import { useEffect, useState } from 'react';
import { api } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';

// Loaded lazily with React.lazy (see App.jsx). Only users with role "organizer" can reach it.
function OrganizerPanel() {
  const { token } = useAuth();
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({ title: '', category: '', date: '', venue: '', ticketsAvailable: 50 });
  const [message, setMessage] = useState({ type: '', text: '' });

  const loadEvents = () => api('/events').then((r) => setEvents(r.data)).catch(() => {});

  useEffect(() => {
    loadEvents();
  }, []);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const createEvent = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    try {
      await api('/events', { method: 'POST', token, body: { ...form, ticketsAvailable: Number(form.ticketsAvailable) } });
      setMessage({ type: 'success', text: 'Event created!' });
      setForm({ title: '', category: '', date: '', venue: '', ticketsAvailable: 50 });
      loadEvents();
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    }
  };

  return (
    <div>
      <h2>Organizer Panel</h2>
      <form className="panel" onSubmit={createEvent}>
        <h3>Create a new event</h3>
        <input name="title" placeholder="Title" value={form.title} onChange={change} required />
        <input name="category" placeholder="Category" value={form.category} onChange={change} />
        <input name="date" type="date" value={form.date} onChange={change} required />
        <input name="venue" placeholder="Venue" value={form.venue} onChange={change} required />
        <input name="ticketsAvailable" type="number" min="0" value={form.ticketsAvailable} onChange={change} required />
        <button className="btn" type="submit">Create Event</button>
        {message.text && <p className={message.type === 'error' ? 'error' : 'success'}>{message.text}</p>}
      </form>

      <h3>All events ({events.length})</h3>
      <table>
        <thead><tr><th>Title</th><th>Category</th><th>Date</th><th>Venue</th><th>Tickets left</th></tr></thead>
        <tbody>
          {events.map((ev) => (
            <tr key={ev._id}>
              <td>{ev.title}</td>
              <td>{ev.category}</td>
              <td>{new Date(ev.date).toLocaleDateString('en-IN')}</td>
              <td>{ev.venue}</td>
              <td>{ev.ticketsAvailable}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default OrganizerPanel;
