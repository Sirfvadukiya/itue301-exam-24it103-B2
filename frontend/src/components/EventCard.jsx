// Reusable card. Receives everything through props (title, category, date, venue,
// ticketsAvailable) plus an optional onBook callback from the parent.
function EventCard({ title, category, date, venue, ticketsAvailable, onBook }) {
  const soldOut = ticketsAvailable === 0; // simple check: sold-out logic lives at the top

  return (
    <div className="card">
      <span className="tag">{category || 'General'}</span>
      <h3>{title}</h3>
      <p>📅 {new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
      <p>📍 {venue}</p>
      <p>🎟️ Tickets available: <strong>{ticketsAvailable}</strong></p>

      {soldOut ? (
        <span className="badge-soldout">Sold Out</span>
      ) : (
        <button className="btn" onClick={onBook}>Book</button>
      )}
    </div>
  );
}

export default EventCard;
