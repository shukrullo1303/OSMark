import React, { useEffect, useState } from 'react';
import { getProfile } from '../services/auth';
import { getMyEnrollments } from '../services/enrollments';
import '../styles/pages/ProfilePage.css';

const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const res = await getProfile();
                setUser(res.data);
            } catch (e) {
                console.error(e);
                setUser(null);
            }
            try {
                const res2 = await getMyEnrollments();
                setEnrollments(Array.isArray(res2.data) ? res2.data : res2.data.results || []);
            } catch (e) {
                console.error(e);
                setEnrollments([]);
            }
            setLoading(false);
        }
        load();
    }, [])

    if (loading) {
        return <div className="site-container"><div className="loading-state">Loading profile...</div></div>;
    }

    return (
        <div className="site-container">
            <div className="profile-layout sidebar">
                <div className="profile-main">
                    <section className="profile-section">
                        <h2>My Profile</h2>
                        {user ? (
                            <div className="profile-card">
                                <div className="profile-avatar">
                                    {user.username?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
                                </div>
                                <div className="profile-info">
                                    <h3>{user.username || 'User'}</h3>
                                    <p className="profile-email">{user.email}</p>
                                    <p className="profile-joined">Member since {new Date(user.date_joined || Date.now()).toLocaleDateString()}</p>
                                </div>
                            </div>
                        ) : (
                            <div className="empty-state">Profile not available</div>
                        )}
                    </section>

                    <section className="profile-section">
                        <h2>My Enrollments</h2>
                        {enrollments.length === 0 ? (
                            <div className="empty-state">
                                <p>No enrollments yet</p>
                                <p className="empty-desc">Explore courses and enroll to get started</p>
                            </div>
                        ) : (
                            <div className="enrollments-list">
                                {enrollments.map((e) => (
                                    <div key={e.id} className="enrollment-item">
                                        <div className="enrollment-header">
                                            <h4>{e.course_title || e.course}</h4>
                                            <span className="enrollment-status">In Progress</span>
                                        </div>
                                        <p className="enrollment-date">
                                            Enrolled: {new Date(e.created_at).toLocaleDateString()}
                                        </p>
                                        <div className="enrollment-progress">
                                            <div className="progress-bar">
                                                <div className="progress-fill" style={{ width: '35%' }}></div>
                                            </div>
                                            <small>35% complete</small>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                </div>

                <aside className="profile-sidebar">
                    <div className="sidebar-card">
                        <h4>Account Stats</h4>
                        <div className="stat-item">
                            <span className="stat-value">{enrollments.length}</span>
                            <span className="stat-label">Courses Enrolled</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-value">0</span>
                            <span className="stat-label">Courses Completed</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-value">0</span>
                            <span className="stat-label">Certificates</span>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    )
}

export default ProfilePage;
