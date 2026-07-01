import { useState, useMemo } from 'react';

function AdminDashboard({ users = [], bookings = [], reviews = [] }) {
  const [usersData, setUsersData] = useState(users);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

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

  //  Delete user
  const deleteUser = (id) => {
    setUsersData((prev) => prev.filter((user) => user.id !== id));
  };

  //  Filter + Search logic
  const filteredUsers = useMemo(() => {
    return usersData.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === 'All' || user.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [usersData, searchTerm, statusFilter]);

  // Stats
  const stats = useMemo(() => {
    return {
      activeUsers: usersData.filter((u) => u.status === 'Active').length,
      totalUsers: usersData.length,
      bookings: bookings.length,
      reviews: reviews.length,
    };
  }, [usersData, bookings, reviews]);

  return (
    <section className="page-card">
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
        <article className="card">
          <h3>User management</h3>

          {/* Search + Filter Controls */}
          <div className="controls">
            <input
              type="text"
              placeholder="Search by name or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All</option>
              <option value="Active">Active</option>
              <option value="Pending">Pending</option>
            </select>
          </div>

          {/*  User List */}
          {filteredUsers.length === 0 ? (
            <p>No matching users.</p>
          ) : (
            <ul className="list-card">
              {filteredUsers.map((user) => (
                <UserRow
                  key={user.id}
                  user={user}
                  onToggle={toggleStatus}
                  onDelete={deleteUser}
                />
              ))}
            </ul>
          )}
        </article>

        <article className="card">
          <h3>Platform notes</h3>
          <p>Featured listings can be promoted from the admin console.</p>
          <p>Analytics can later be connected to live backend data.</p>
        </article>
      </div>
    </section>
  );
}

/* Components */

function StatCard({ title, value }) {
  return (
    <article className="stat-card">
      <h3>{title}</h3>
      <p>{value}</p>
    </article>
  );
}

function UserRow({ user, onToggle, onDelete }) {
  return (
    <li className="user-row">
      <div>
        <strong>{user.name}</strong> — {user.role}
        <span className={`status ${user.status.toLowerCase()}`}>
          {user.status}
        </span>
      </div>

      <div className="actions">
        <button onClick={() => onToggle(user.id)}>Toggle</button>
        <button
          className="danger"
          onClick={() => onDelete(user.id)}
        >
          Delete
        </button>
      </div>
    </li>
  );
}

export default AdminDashboard;
``