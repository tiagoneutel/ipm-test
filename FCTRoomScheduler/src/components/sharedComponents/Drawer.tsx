import React from 'react';
import './FiltersDrawer.css';

type Drawer = {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
};

const Drawer: React.FC<Drawer> = ({ isOpen, onClose, children }) => (
    <div className={`sliding-tab ${isOpen ? 'open' : ''}`}>
        <button className="sliding-tab-close-btn" onClick={onClose}>
            Close
        </button>
        {children}
    </div>
);

export default Drawer;