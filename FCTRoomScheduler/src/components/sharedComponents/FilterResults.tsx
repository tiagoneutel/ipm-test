import React, { useState } from 'react';
import buildingsInfo from '../../storage/buildingsInfo.json';
import './FilterResults.css';
import { useNavigate } from 'react-router-dom';
import FloatingButton from './FloatingButton';
import LoginRegisterPopup from './LoginRegisterPopup';
import languageJSON from '../../storage/language.json';

interface FilterResultsProps {
    filterParams: {
        roomCapacity: string;
        selectedMaterials: string[];
        selectedQualities: string[];
        selectedRoomType: string;
    };
}

const FilterResults: React.FC<FilterResultsProps> = ({ filterParams }) => {
    const { roomCapacity, selectedMaterials, selectedQualities, selectedRoomType } = filterParams;
    const navigate = useNavigate();
    const [isAccountOpen, setIsAccountOpen] = useState(false);
    
    
    const toggleAccount = () => {
        setIsAccountOpen(!isAccountOpen);
    };

    const filterResults = Object.keys(buildingsInfo).reduce((results, buildingKey) => {
        const building = buildingsInfo[buildingKey];

        const floorMatches = building.floors.reduce((floorResults, floor) => {
            const roomMatches = floor.rooms.filter(room => {
                const matchesCapacity = roomCapacity ? room.capacity >= parseInt(roomCapacity) : true;
                const matchesMaterials = selectedMaterials.length > 0 ? selectedMaterials.every(material => room.materials.includes(material)) : true;
                const matchesQualities = selectedQualities.length > 0 ? selectedQualities.every(quality => room.qualities.includes(quality)) : true;
                const matchesRoomType = selectedRoomType ? room.roomType === selectedRoomType : true;

                return matchesCapacity && matchesMaterials && matchesQualities && matchesRoomType;
            });

            if (roomMatches.length > 0) {
                floorResults.push({
                    floor: floor.floor,
                    rooms: roomMatches
                });
            }

            return floorResults;
        }, []);

        if (floorMatches.length > 0) {
            results.push({
                buildingName: buildingKey,
                floors: floorMatches
            });
        }

        return results;
    }, []);

    return (
        <>
            <FloatingButton onClick={() => navigate('/')} type="home" />
            <FloatingButton onClick={toggleAccount} type="account" />
            <FloatingButton onClick={() => {
            const language = languageJSON.language;
            languageJSON.language = language === "en" ? "pt" : "en";
            }} type={"language"} />
            {isAccountOpen ? <LoginRegisterPopup onClose={toggleAccount} /> : <></>}

            <div className={"header"}>
                <h1>Filter Results</h1>
            </div>

            <div className={"filter-results"}>
                {filterResults.length > 0 ? (
                    filterResults.map((building, index) => (
                        <div key={index} className="building-result">
                            <h2 onClick={() => navigate(`/building/${building.buildingName}`)}>Building {building.buildingName.toUpperCase()}</h2>
                            {building.floors.map((floor, floorIndex) => (
                                <div key={floorIndex} className="floor-result">
                                    <h3>Floor {floor.floor}</h3>
                                    {floor.rooms.map((room, roomIndex) => (
                                        <div key={roomIndex} className="room-result">
                                            <p onClick={() => navigate(`/building/${building.buildingName}/room/${room.name}`)}>Room {room.name}</p>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    ))
                ) : (
                    <p>No results found</p>
                )}
            </div>
        </>
    );
};

export default FilterResults;