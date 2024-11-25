import React from 'react';
import { clearUserSession, isLoggedIn, getUser } from '../../session/session';
import './AccountPopup.css';

const AccountPopup = ({ onLoginRegister, onLogout, onMyAccount }) => {
    return (
        <div className="account-popup">
            {isLoggedIn() ? (
                <>
                    <p>Welcome, {getUser().username}</p>
                    <div className="button-container">
                        <button onClick={onMyAccount}>My Account</button>
                        <button className="logout-button" onClick={onLogout}>Logout</button>
                    </div>
                </>
            ) : (
                <div className="button-container">
                    <button onClick={onLoginRegister}>Login or Register</button>
                </div>
            )}
        </div>
    );
};

export default AccountPopup;