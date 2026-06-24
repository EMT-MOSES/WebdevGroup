import { useState, useMemo } from 'react';

function BookingAndEvents({ artists = [], venues = [], events = [] }) {
  const [step, setStep] = useState(1);
  const [selectionType, setSelectionType] = useState('artist');

  const [selectedId, setSelectedId] = useState(
    artists[0]?.id || venues[0]?.id || null
  );

  const [form, setForm] = useState({
    eventTitle: '',
    eventDate: '',
    paymentMethod: 'M-Pesa',
  });

  const [confirmed, setConfirmed] = useState(false);

  // Memoized options
  const options = useMemo(
    () => (selectionType === 'artist' ? artists : venues),
    [selectionType, artists, venues]
  );

  const selectedItem = useMemo(
    () => options.find((item) => item.id === selectedId) || options[0],
    [options, selectedId]
  );

  // Step navigation
  const nextStep = () => setStep((prev) => Math.min(prev + 1, 3));
  const previousStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const confirmBooking = () => {
    setConfirmed(true);
  };

  // Handle form changes
  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <section className="page-card">
      {/* Header */}
      <div className="section-heading">
        <div>
          <p className="eyebrow">Booking & Events</p>
          <h2>Plan a booking in three steps</h2>
        </div>

        <div className="stepper">
          {[1, 2, 3].map((num) => (
            <span key={num} className={step >= num ? 'active-step' : ''}>
              {num}
            </span>
          ))}
        </div>
      </div>

      {/* STEP 1 */}
      {step === 1 && (
        <div>
          <p>Select the kind of partner you want to book.</p>

          <div className="nav-pills">
            {['artist', 'venue'].map((type) => (
              <button
                key={type}
                className={selectionType === type ? 'active' : ''}
                onClick={() => {
                  setSelectionType(type);
                  setSelectedId(null);
                }}
              >
                {type === 'artist' ? 'Artist' : 'Venue'}
              </button>
            ))}
          </div>

          <div className="cards">
            {options.map((item) => (
              <button
                key={item.id}
                className={`choice-card ${
                  selectedId === item.id ? 'selected' : ''
                }`}
                onClick={() => setSelectedId(item.id)}
              >
                <h3>{item.name}</h3>
                <p>{item.location}</p>
                <p>
                  {item.capacity
                    ? `Capacity: ${item.capacity}`
                    : item.genre}
                </p>
              </button>
            ))}
          </div>

          <button disabled={!selectedId} onClick={nextStep}>
            Continue
          </button>
        </div>
      )}

      {/* STEP 2 */}
      {step === 2 && selectedItem && (
        <div>
          <p>Book {selectedItem.name} for an upcoming event.</p>

          <div className="form-card vertical">
            <input
              value={form.eventTitle}
              onChange={(e) =>
                handleChange('eventTitle', e.target.value)
              }
              placeholder="Event name"
            />

            <input
              type="date"
              value={form.eventDate}
              onChange={(e) =>
                handleChange('eventDate', e.target.value)
              }
            />

            <select
              value={form.paymentMethod}
              onChange={(e) =>
                handleChange('paymentMethod', e.target.value)
              }
            >
              <option value="M-Pesa">M-Pesa</option>
              <option value="Cash">Cash</option>
              <option value="Bank transfer">Bank transfer</option>
            </select>
          </div>

          <div className="button-row">
            <button onClick={previousStep}>Back</button>
            <button
              onClick={nextStep}
              disabled={!form.eventDate}
            >
              Review
            </button>
          </div>
        </div>
      )}

      {/* STEP 3 */}
      {step === 3 && selectedItem && (
        <div>
          <h3>Booking summary</h3>

          <div className="card">
            <p><strong>Partner:</strong> {selectedItem.name}</p>
            <p>
              <strong>Event:</strong>{' '}
              {form.eventTitle || 'Community event'}
            </p>
            <p>
              <strong>Date:</strong> {form.eventDate || 'TBD'}
            </p>
            <p>
              <strong>Payment:</strong> {form.paymentMethod}
            </p>
          </div>

          <div className="button-row">
            <button onClick={previousStep}>Back</button>
            <button onClick={confirmBooking}>
              Confirm booking
            </button>
          </div>

          {confirmed && (
            <p className="success-note">
              Booking request submitted successfully.
            </p>
          )}
        </div>
      )}

      {/* EVENTS LIST */}
      <div className="cards">
        {events.map((event) => (
          <article className="card" key={event.id}>
            <h3>{event.title}</h3>
            <p>{event.location}</p>
            <p>{event.date}</p>
            <span className="chip">{event.type}</span>
          </article>
        ))}
      </div>
    </section>
  );
}

export default BookingAndEvents;