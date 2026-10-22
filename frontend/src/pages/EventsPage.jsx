import { useEffect, useState } from 'react';
import { api } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';
import EventCard from '../components/EventCard.jsx';

function EventsPage() {
  const { token } = useAuth();

  // Task 4: three states for the API call
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // search box + booking form state (Task 2)
  const [search, setSearch] = useState('');
  const [selectedEvent, setSelectedEvent] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [booking, setBooking] = useState(false);

  const fetchEvents = async () => {
    try {
      const res = await api('/events');
      setEvents(res.data);
      setError('');
    } catch (err) {
      setError(err.message || 'Could not load events');
    } finally {
      setLoading(false);
    }
  };

  // runs once when the component mounts
  useEffect(() => {
    fetchEvents();
  }, []);

  // client-side filter: derived on every render from the full list, no new API request
  const filteredEvents = events.filter((ev) => ev.title.toLowerCase().includes(search.toLowerCase()));

  const handleBook = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    if (!selectedEvent) return setMessage({ type: 'error', text: 'Please select an event' });

    setBooking(true);
    try {
      const res = await api('/tickets', { method: 'POST', token, body: { eventId: selectedEvent, quantity: Number(quantity) } });
      setMessage({ type: 'success', text: `Booked ${quantity} ticket(s)! ${res.ticketsRemaining} left for this event.` });
      setQuantity(1);
      fetchEvents(); // refresh the counts shown on the cards
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setBooking(false);
    }
  };

  return (
    <div>
      <h2>Upcoming Events</h2>

      {/* Booking form */}
      <form className="panel booking" onSubmit={handleBook}>
        <h3>Book Tickets</h3>
        <select value={selectedEvent} onChange={(e) => setSelectedEvent(e.target.value)}>
          <option value="">-- Select an event --</option>
          {events.map((ev) => (
            <option key={ev._id} value={ev._id} disabled={ev.ticketsAvailable === 0}>
              {ev.title} {ev.ticketsAvailable === 0 ? '(Sold Out)' : `(${ev.ticketsAvailable} left)`}
            </option>
          ))}
        </select>
        <input type="number" min="1" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
        <button className="btn" type="submit" disabled={booking}>{booking ? 'Booking...' : 'Confirm Booking'}</button>
        {message.text && <p className={message.type === 'error' ? 'error' : 'success'}>{message.text}</p>}
      </form>

      <input
        className="search"
        type="text"
        placeholder="Search events by title..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading && <p className="info">Loading events...</p>}
      {error && <p className="error">Error: {error}</p>}
      {!loading && !error && filteredEvents.length === 0 && <p className="info">No events found.</p>}

      <div className="grid">
        {filteredEvents.map((ev) => (
          <EventCard
            key={ev._id}
            title={ev.title}
            category={ev.category}
            date={ev.date}
            venue={ev.venue}
            ticketsAvailable={ev.ticketsAvailable}
            onBook={() => {
              setSelectedEvent(ev._id);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default EventsPage;
