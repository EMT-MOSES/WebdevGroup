import { useState, useMemo } from 'react';

function ReviewsAndBackend({ reviews = [], artists = [], venues = [] }) {
  const [reviewList, setReviewList] = useState(reviews);
  const [form, setForm] = useState({
    author: '',
    text: '',
    rating: '5',
  });
  const [search, setSearch] = useState('');

  // Handle input change
  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  // ✅ Add review
  const addReview = (e) => {
    e.preventDefault();

    if (!form.author.trim() || !form.text.trim()) return;

    const newReview = {
      id: Date.now(),
      author: form.author.trim(),
      text: form.text.trim(),
      rating: Number(form.rating),
      target: 'New review',
      date: new Date().toLocaleDateString(),
    };

    setReviewList((prev) => [newReview, ...prev]);

    setForm({
      author: '',
      text: '',
      rating: '5',
    });
  };

  // ✅ Delete review
  const deleteReview = (id) => {
    if (window.confirm('Delete this review?')) {
      setReviewList((prev) => prev.filter((r) => r.id !== id));
    }
  };

  // ✅ Filter reviews (search by author or text)
  const filteredReviews = useMemo(() => {
    return reviewList.filter(
      (r) =>
        r.author.toLowerCase().includes(search.toLowerCase()) ||
        r.text.toLowerCase().includes(search.toLowerCase())
    );
  }, [reviewList, search]);

  return (
    <section className="page-card">
      {/* Header */}
      <div className="section-heading">
        <div>
          <p className="eyebrow">Reviews & Backend</p>
          <h2>Ratings, reviews, and future-ready data flow</h2>
        </div>
      </div>

      {/* Featured */}
      <div className="dashboard-grid">
        <InfoCard title="Featured artists">
          {artists.map((artist) => (
            <p key={artist.id}>
              {artist.name} — ⭐ {artist.rating}/5
            </p>
          ))}
        </InfoCard>

        <InfoCard title="Featured venues">
          {venues.map((venue) => (
            <p key={venue.id}>
              {venue.name} — {venue.capacity} seats
            </p>
          ))}
        </InfoCard>
      </div>

      {/* Add Review */}
      <form onSubmit={addReview} className="form-card vertical">
        <input
          value={form.author}
          onChange={(e) => handleChange('author', e.target.value)}
          placeholder="Your name"
        />

        <textarea
          value={form.text}
          onChange={(e) => handleChange('text', e.target.value)}
          placeholder="Write a review"
          rows="3"
        />

        <select
          value={form.rating}
          onChange={(e) => handleChange('rating', e.target.value)}
        >
          {[5, 4, 3, 2, 1].map((r) => (
            <option key={r} value={r}>
              {r} star{r > 1 ? 's' : ''}
            </option>
          ))}
        </select>

        <button type="submit" disabled={!form.author || !form.text}>
          Submit review
        </button>
      </form>

      {/* ✅ Search */}
      <input
        className="search-input"
        placeholder="Search reviews..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Reviews List */}
      <div className="cards">
        {filteredReviews.length === 0 ? (
          <p>No reviews found.</p>
        ) : (
          filteredReviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              onDelete={deleteReview}
            />
          ))
        )}
      </div>
    </section>
  );
}

/* ✅ Components */

function InfoCard({ title, children }) {
  return (
    <article className="card">
      <h3>{title}</h3>
      {children}
    </article>
  );
}

function ReviewCard({ review, onDelete }) {
  return (
    <article className="card review-card">
      <div className="review-header">
        <h3>{review.author}</h3>
        <span className="rating">
          {'★'.repeat(review.rating)}
        </span>
      </div>

      <p>{review.text}</p>

      <div className="review-footer">
        <small>{review.date}</small>
        <button
          className="danger small-btn"
          onClick={() => onDelete(review.id)}
        >
          Delete
        </button>
      </div>
    </article>
  );
}

export default ReviewsAndBackend;