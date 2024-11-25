import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import buildingsInfo from '../../storage/buildingsInfo.json';
import './Building.css';
import FloatingButton from '../sharedComponents/FloatingButton';
import LoginRegisterPopup from '../sharedComponents/LoginRegisterPopup';
import languageJSON from '../../storage/language.json';

const Building = () => {
    const { buildingName } = useParams<{ buildingName: string }>();
    const navigate = useNavigate();
    const building = buildingsInfo[buildingName];
    const [selectedFloor, setSelectedFloor] = useState(0);
    const [isAccountOpen, setIsAccountOpen] = useState(false);

    const toggleAccount = () => {
        setIsAccountOpen(!isAccountOpen);
    };

    if (!building) {
        return <div>Building not found</div>;
    }

    return (
        <div className="container">
            <FloatingButton onClick={() => navigate(-1)} type={"back"} />
            <FloatingButton onClick={toggleAccount} type={"account"} />
            <FloatingButton onClick={() => {
            const language = languageJSON.language;
            languageJSON.language = language === "en" ? "pt" : "en";
            }} type={"language"} />
            {isAccountOpen ? <LoginRegisterPopup onClose={toggleAccount} /> : <></>}
            <h1 className="building-title">Building: {buildingName.toUpperCase()}</h1>
            <img className="building-image" src={building.image} alt={`Building ${buildingName} Image Not Found`} />
            <p className='building-info'>Number of Floors: {building.numberOfFloors}</p>

            {/* Horizontal List for Floors */}
            <div className="floor-selector">
                {building.floors.map((_, index) => (
                    <button
                        key={index}
                        className={selectedFloor === index ? 'selected' : ''}
                        onClick={() => setSelectedFloor(index)}
                    >
                        Floor {index + 1}
                    </button>
                ))}
            </div>

            {/* Display Rooms Based on Selected Floor */}
            <div className="rooms-list">
                {building.floors[selectedFloor].rooms.map((room, index) => (
                    <div
                        key={index}
                        className="room-card"
                        onClick={() => navigate(`/building/${buildingName}/room/${room.name}`)}
                    >
                        <h3>{room.name}</h3>
                        <p>{room.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Building;