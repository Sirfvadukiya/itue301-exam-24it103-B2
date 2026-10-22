import { useEffect, useState } from 'react';
import { api } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';

function MyTicketsPage() {
  const { token } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadTickets = async () => {
    try {
      const res = await api('/tickets/my', { token });
      setTickets(res.data);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTickets();
  }, []);

  const cancelTicket = async (id) => {
    try {
      await api(`/tickets/${id}/status`, { method: 'PATCH', token, body: { status: 'cancelled' } });
      loadTickets();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h2>My Tickets</h2>
      {loading && <p className="info">Loading your tickets...</p>}
      {error && <p className="error">Error: {error}</p>}
      {!loading && !error && tickets.length === 0 && <p className="info">You have not booked any tickets yet.</p>}

      {tickets.length > 0 && (
        <table>
          <thead>
            <tr><th>Event</th><th>Date</th><th>Venue</th><th>Qty</th><th>Status</th><th>Action</th></tr>
          </thead>
          <tbody>
            {tickets.map((t) => (
              <tr key={t._id}>
                <td>{t.eventId?.title || 'Event removed'}</td>
                <td>{t.eventId ? new Date(t.eventId.date).toLocaleDateString('en-IN') : '-'}</td>
                <td>{t.eventId?.venue || '-'}</td>
                <td>{t.quantity}</td>
                <td><span className={`status ${t.status}`}>{t.status}</span></td>
                <td>
                  {t.status === 'booked' && (
                    <button className="btn small danger" onClick={() => cancelTicket(t._id)}>Cancel</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default MyTicketsPage;
