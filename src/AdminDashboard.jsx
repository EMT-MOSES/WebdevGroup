import { useState, useMemo } from 'react';

function AdminDashboard({ users = [], bookings = [], reviews = [] }) {
  const [usersData, setUsersData] = useState(users);

  // Toggle user status
  const toggleStatus = (id) => {
    setUsersData((prev) =>
      prev.map((user) =>
        user.id === id
          ? {
              ...user,
              status: user.status === 'Active' ? 'Pending' : 'Active',
            }
          : user
      )
    );
  };

  // Derived stats (memoized for performance)
  const stats = useMemo(() => {
    const activeUsers = usersData.filter(
      (user) => user.status === 'Active'
    ).length;

    return {
      activeUsers,
      totalUsers: usersData.length,
      bookings: bookings.length,
      reviews: reviews.length,
    };
  }, [usersData, bookings, reviews]);

  return (
    <section className="page-card">
      {/* Header */}
      <div className="section-heading">
        <div>
          <p className="eyebrow">Administration</p>
          <h2>Platform controls and insights</h2>
        </div>
      </div>

      {/* Stats */}
      <div className="stat-grid">
        <StatCard title="Active users" value={stats.activeUsers} />
        <StatCard title="Total users" value={stats.totalUsers} />
        <StatCard title="Bookings" value={stats.bookings} />
        <StatCard title="Reviews" value={stats.reviews} />
      </div>

      <div className="dashboard-grid">
        {/* User Management */}
        <article className="card">
          <h3>User management</h3>

          {usersData.length === 0 ? (
            <p>No users available.</p>
          ) : (
            <ul className="list-card">
              {usersData.map((user) => (
                <UserRow
                  key={user.id}
                  user={user}
                  onToggle={toggleStatus}
                />
              ))}
            </ul>
          )}
        </article>

        {/* Notes */}
        <article className="card">
          <h3>Platform notes</h3>
          <p>Featured listings can be promoted from the admin console.</p>
          <p>Analytics can later be connected to live backend data.</p>
        </article>
      </div>
    </section>
  );
}

/* ✅ Reusable components */

function StatCard({ title, value }) {
  return (
    <article className="stat-card">
      <h3>{title}</h3>
      <p>{value}</p>
    </article>
  );
}

function UserRow({ user, onToggle }) {
  return (
    <li className="user-row">
      <span>
        {user.name} — {user.role}
      </span>

      <span className={`status ${user.status.toLowerCase()}`}>
        {user.status}
      </span>

      <button
        className="small-btn"
        onClick={() => onToggle(user.id)}
      >
        Toggle
      </button>
    </li>
  );
}

export default AdminDashboard;