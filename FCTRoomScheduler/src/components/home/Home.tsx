import React, { useState } from 'react';
import { MapContainer, TileLayer, Polygon, Tooltip, Marker, Popup } from 'react-leaflet';
import { LatLngTuple } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './Home.css';
import Drawer from '../sharedComponents/Drawer';
import LoginRegisterPopup from '../sharedComponents/LoginRegisterPopup';
import Filters from '../sharedComponents/Filters';
import { useNavigate } from 'react-router-dom';
import FloatingButton from '../sharedComponents/FloatingButton';
import L from 'leaflet';
import languageJSON from '../../storage/language.json';

const center: LatLngTuple = [38.66149464690209, -9.205871106395124];

const teardropIcon = L.icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png', // Example teardrop icon
  iconSize: [30, 40], // Size of the icon
  iconAnchor: [15, 40], // Anchor point of the icon (bottom center)
});

const entranceIcon = L.icon({
  iconUrl: 'https://img.icons8.com/ios/452/door.png', // Replace with the URL/path to your icon
  iconSize: [20, 20], // Adjust size as needed
  iconAnchor: [10, 10], // Center the icon
});


// Array of building data
const buildings = [
  {
    name: 'Edificio II',
    id: 'ii',
    coordinates: [
      [38.661196212074714, -9.204052213323157],
      [38.661578032727064, -9.203434592416215],
      [38.66112924162508, -9.202901279163182],
      [38.66071305205716, -9.203522053938856],
    ] as LatLngTuple[],
    entrances: [
      [38.66151114872347, -9.203478057524197],
      [38.660792855736894, -9.203567407361135],
      [38.66123638240376, -9.20400828555248],
    ] as LatLngTuple[], // Entrance locations
    rooms: [
      { name: 'Room 124', location: [38.66138789664035, -9.203338278195364] as LatLngTuple},
      { name: 'Room 125', location: [38.661056481631626, -9.203265705787098] as LatLngTuple },
      { name: 'Room 126', location: [38.66104089641529, -9.20366209158845] as LatLngTuple},
    ],
  },
  {
    name: 'Departamental',
    id: 'departamental',
    coordinates: [
      [38.66266637116532, -9.207999873437657],
      [38.662646947014245, -9.207447580835272],
      [38.661589652421355, -9.207317370483738],
      [38.66146605085642, -9.207549350307284],
      [38.66174578929658, -9.207876106267744],
      [38.661899125692514, -9.208382464565645],
    ] as LatLngTuple[],
    entrances: [
      [38.66250351686014, -9.207457036670432],
      [38.66225056228438, -9.208267402653872],
    ] as LatLngTuple[], // Entrance locations
    rooms: [
      { name: 'Lab 1', location: [38.6626, -9.2075] as LatLngTuple},
      { name: 'Lab 2', location: [38.6627, -9.2076] as LatLngTuple},
      { name: 'Conference Room', location: [38.6628, -9.2077] as LatLngTuple},
    ],
  },
  {
    name: 'Edificio VII',
    id: 'vii',
    coordinates: [
      [38.66077181333206, -9.20621809580918],
      [38.66077894840998, -9.20528001662725],
      [38.66019764504653, -9.20528767737553],
      [38.660158691969414, -9.206249504822447],
    ] as LatLngTuple[],
    entrances: [
      [38.66080427538354, -9.205770652147919],
  
    ] as LatLngTuple[], // Entrance locations
    rooms: [
      { name: 'Lab 1', location: [38.6626, -9.2075] as LatLngTuple},
      { name: 'Lab 2', location: [38.6627, -9.2076] as LatLngTuple},
      { name: 'Conference Room', location: [38.6628, -9.2077] as LatLngTuple},
    ],
  },

  /* {
    name: 'Edificio IX',
    id: 'ix',
    coordinates: [
      [38.66075379017349, -9.207232361835825],
      [38.660742286862714, -9.206989473333756],
      [38.65989247211617, -9.206988746408857],
      [38.659897144903546, -9.207221274523055],
    ] as LatLngTuple[],
    entrances: [
      [38.660268793785335, -9.206967285154748],
  
    ] as LatLngTuple[], // Entrance locations
    rooms: [
      { name: 'Room 100', location: [38.6626, -9.2075] as LatLngTuple},
      { name: 'Room 101', location: [38.6627, -9.2076] as LatLngTuple},
      { name: 'Room 102', location: [38.6628, -9.2077] as LatLngTuple},
    ],
  },  */ 
  /* {
    name: 'Biblioteca',
    id: 'biblioteca',
    coordinates: [
      [38.66282644168201, -9.205812772175669],
      [38.66281943635069, -9.204814737198316],
      [38.662588414280066, -9.204806895825778],
      [38.66260540736002, -9.205813280257154],
    ] as LatLngTuple[],
    entrances: [
      [38.66258848290698, -9.205421474800323],
   
    ] as LatLngTuple[], 
    rooms: [
    ],
  } */
];

export default function Home() {
  const [isTabOpen, setIsTabOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [hoveredPolygon, setHoveredPolygon] = useState<string | null>(null); // Track hovered polygon
  const [searchClicked, setSearchClicked] = useState(false);
  const [selectedBuilding, setSelectedBuilding] = useState<string | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [roomLocation, setRoomLocation] = useState<LatLngTuple | null>(null); // Track room location

  const navigate = useNavigate();

  const handlePolygonClick = (name: string) => {
    navigate(`/building/${name}`);
  };

  const toggleTab = () => {
    setIsTabOpen(!isTabOpen);
  };

  const toggleAccount = () => {
    setIsAccountOpen(!isAccountOpen);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    setSearchClicked((prevState) => !prevState); // Toggle the indicator state
 
  };

  const handleBuildingChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedBuilding(event.target.value);
    setSelectedRoom(null); // Reset the room when a new building is selected
    setRoomLocation(null); // Reset the room location
  };

  const handleRoomChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedRoomName = event.target.value;
    setSelectedRoom(selectedRoomName);

    // Find the room's location
    const building = buildings.find((b) => b.id === selectedBuilding);
    const room = building?.rooms.find((r) => r.name === selectedRoomName);
    setRoomLocation(room?.location || null);
  };

  return (
    <div className="map-container">
      <MapContainer
        center={center}
        zoom={17}
        style={{ width: '100vw', height: '100vh' }}
        dragging={false}
        scrollWheelZoom={false}
        zoomControl={false}
        doubleClickZoom={false}
      >
        <TileLayer
          url="https://api.maptiler.com/maps/basic-v2/256/{z}/{x}/{y}.png?key=04pdRTC6gIF3rA4KHB79"
          attribution='&copy; <a href="https://www.maptiler.com/copyright/" target="_blank">MapTiler</a> &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap contributors</a>'
        />

        {buildings.map((building, index) => (
          <Polygon
            key={index}
            positions={building.coordinates}
            eventHandlers={{
              click: () => handlePolygonClick(building.id),
              mouseover: () => setHoveredPolygon(building.name),
              mouseout: () => setHoveredPolygon(null),
            }}
            pathOptions={{
              color: 'gray',
              fillColor: hoveredPolygon === building.name ? 'blue' : 'gray', // Change color on hover
              fillOpacity: hoveredPolygon === building.name ? 0.3 : 0.1, // Adjust transparency
              weight: 1,
            }}
          >

{building.entrances.map((entrance, entranceIndex) => (
        <Marker
          key={entranceIndex}
          position={entrance}
          icon={entranceIcon}
        >
          <Tooltip direction="top">Entrance</Tooltip>
        </Marker>
      ))}
   

            <Tooltip direction="bottom" permanent>
              {building.name}
            </Tooltip>
          </Polygon>
        ))}

     
{roomLocation && <Marker position={roomLocation} icon={teardropIcon}></Marker>}

      </MapContainer>

      <FloatingButton onClick={toggleTab} type={"filters"} />
      <FloatingButton onClick={toggleAccount} type={"account"} />
      <FloatingButton onClick={toggleSearch} type={"search"} />
      <FloatingButton onClick={() => {
        const language = languageJSON.language;
        languageJSON.language = language === "en" ? "pt" : "en";
      }} type={"language"} />

      {searchClicked && (
        <div className="search-indicator">
          <h3>Select Building and Room</h3>

          {/* Building Dropdown */}
          <label htmlFor="building-select">Building:</label>
          <select
            id="building-select"
            value={selectedBuilding || ''}
            onChange={handleBuildingChange}
          >
            <option value="" disabled>
              Select a building
            </option>
            {buildings.map((building) => (
              <option key={building.id} value={building.id}>
                {building.name}
              </option>
            ))}
          </select>

          {/* Room Dropdown */}
          {selectedBuilding && (
            <>
              <label htmlFor="room-select">Room:</label>
              <select
                id="room-select"
                value={selectedRoom || ''}
                onChange={handleRoomChange}
              >
                <option value="" disabled>
                  Select a room
                </option>
                {buildings
                  .find((building) => building.id === selectedBuilding)
                  ?.rooms.map((room, index) => (
                    <option key={index} value={room.name}>
                      {room.name}
                    </option>
                  ))}
              </select>
            </>
          )}

          {/* Display Selected Room */}
          {selectedRoom && (
            <p>
              Selected: {selectedBuilding} - {selectedRoom}
            </p>
          )}
        </div>
      )}

      <Drawer isOpen={isTabOpen} onClose={toggleTab}>
        <Filters />
      </Drawer>

      {isAccountOpen ? (
          <div className="login-register-popup">
            <LoginRegisterPopup onClose={toggleAccount} />
          </div>
        ) : null
      }

      <div className="map-header">
        <h1>NOVA FCT ROOM SCHEDULER</h1>
      </div>
    </div>
  );
}