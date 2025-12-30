import React, { useEffect, useState } from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { getProfile, logout } from '../services/auth';

const Navigation = () => {
    const [user, setUser] = useState(null);
    const nav = useNavigate();

    useEffect(() => {
        const load = async () => {
            try {
                const res = await getProfile();
                setUser(res.data);
            } catch (err) {
                setUser(null);
            }
        };
        load();
    }, []);

    const handleLogout = () => {
        logout();
        setUser(null);
        nav('/');
    };

    return (
        <Navbar bg="light" expand="lg">
            <Container>
                <Navbar.Brand as={Link} to="/">LMS</Navbar.Brand>
                <Navbar.Toggle />
                <Navbar.Collapse>
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/">Home</Nav.Link>
                    </Nav>
                    <Nav>
                        {user ? (
                            <>
                                <Nav.Link as={Link} to="/profile">{user.username || user.email}</Nav.Link>
                                <Button variant="outline-secondary" onClick={handleLogout}>Logout</Button>
                            </>
                        ) : (
                            <>
                                <Button as={Link} to="/login" variant="primary" className="me-2">Login</Button>
                                <Button as={Link} to="/register" variant="outline-primary">Sign up</Button>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default Navigation;
