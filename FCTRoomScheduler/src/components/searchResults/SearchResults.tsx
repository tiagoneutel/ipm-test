import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import buildingsInfo from '../../storage/buildingsInfo.json';
import './SearchResults.css';
import FloatingButton from '../sharedComponents/FloatingButton';
import LoginRegisterPopup from '../sharedComponents/LoginRegisterPopup';
import languageJSON from '../../storage/language.json';

const typeOptions = [
    "building",
    "floor",
    "room"
];

interface SearchResultsProps {
    defaultSearchType?: string;
    defaultSearchInput?: string;
}

const SearchResults = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const searchInput = queryParams.get('input') || '';
    const searchType = queryParams.get('type') || '';
    const [isAccountOpen, setIsAccountOpen] = useState(false);
    let searchResultText: String;
    if (searchType == "" && searchInput == "") searchResultText = "Retrieving all rooms" 
    else if (searchType == "" && searchInput != "") searchResultText = "Search Results for Input: " + searchInput 
    else if (searchType != "" && searchInput == "") searchResultText = "Search Results for Type: " + searchType 
    else searchResultText = "Searching for " + searchType.charAt(0).toUpperCase() + searchType.slice(1) + `s with the Input: ${searchInput}`;

    const toggleAccount = () => {
        setIsAccountOpen(!isAccountOpen);
    };

    const searchResults = Object.keys(buildingsInfo).reduce((results, buildingKey) => {
        if(searchType != "" && typeOptions.filter(type => type.toLowerCase() == searchType.toLowerCase()).length == 0){
            return "Empty";
        }

        const building = buildingsInfo[buildingKey];
        const buildingNameMatch = buildingKey.toLowerCase().includes(searchInput.toLowerCase());

        if (searchType != "building"){
            const floorMatches = building.floors.reduce((floorResults, floor) => {
                const floorMatch = floor.floor.toString().includes(searchInput);

                if (searchType != "floor") {
                    const roomMatches = floor.rooms.filter(room => {
                        const roomNameMatch = room.name.toLowerCase().includes(searchInput.toLowerCase());
                        return roomNameMatch;
                    });

                    if (floorMatch || roomMatches.length > 0) {
                        floorResults.push({
                            floor: floor.floor,
                            rooms: roomMatches
                        });
                    }
                } else if (floorMatch) {
                    floorResults.push({
                        floor: floor.floor,
                        rooms: floor.rooms
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
            
        } else if (buildingNameMatch) {
            results.push({
                buildingName: buildingKey,
                floors: []
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
                <h1>Search Results</h1>
            </div>

            {
                searchResults != "Empty" ? (
                    <>
                        <div className={"search-input"}>
                            <h2>{searchResultText}</h2>
                        </div>

                        <div className={"search-results"}>
                        {searchResults.length > 0 ? (
                                searchResults.map((building, index) => (
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
                ) : (
                    <>
                        <p className="errorFont">Invalid Search Type: {searchType}</p>
                        <p className="alignedText">
                            <span className="validTypes">Valid Search Types:</span>
                            <span className="searchTypes">{typeOptions.join(', ')}</span>
                        </p>
                    </>
                )   
            }

            
        </>
    );
}

export default SearchResults;