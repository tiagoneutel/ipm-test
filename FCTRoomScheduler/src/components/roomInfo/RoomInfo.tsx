import React, { useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import buildingsInfo from '../../storage/buildingsInfo.json';
import translations from '../../storage/translations.json';
import './RoomInfo.css';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import FloatingButton from '../sharedComponents/FloatingButton';
import languageJSON from '../../storage/language.json';
import LoginRegisterPopup from '../sharedComponents/LoginRegisterPopup';

const language = "en";

let roomIndex: number = 0;

const responsive = {
    desktop: {
        breakpoint: { max: 3000, min: 1024 },
        items: 4,
        slidesToSlide: 4 // optional, default to 1.
    },
    tablet: {
        breakpoint: { max: 1024, min: 768 },
        items: 3,
        slidesToSlide: 3 // optional, default to 1.
    },
    mobile: {
        breakpoint: { max: 767, min: 464 },
        items: 2,
        slidesToSlide: 1 // optional, default to 1.
    }
};




const RoomInfo = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [selectedOption, setSelectedOption] = useState(translations[language].roomInfo.buttonRoomInfo);
    const { buildingName, roomName } = useParams<{ buildingName: string; roomName: string }>();
    const building = buildingsInfo[buildingName];
    const [roomInfo] = buildingsInfo[buildingName];
    const [isAccountOpen, setIsAccountOpen] = useState(false);
    const [selectedButton, setSelectedButton] = useState(translations[language].roomInfo.buttonRoomInfo);

    const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);

    const toggleAccount = () => {
        setIsAccountOpen(!isAccountOpen);
    };

    const findFloorIndex = (buildingName: string, roomName: string): number | null => {
        const building = buildingsInfo[buildingName];
        if (!building) {
            console.log('Building not found');
            return null;
        }
    
        for (let floorIndex = 0; floorIndex < building.floors.length; floorIndex++) {
            const floor = building.floors[floorIndex];
            for (let roomIndex = 0; roomIndex < floor.rooms.length; roomIndex++) {
                const room = floor.rooms[roomIndex];
                if (room.name === roomName) {
                    return floorIndex;
                }
            }
        }
    
        console.log('Room not found in the building');
        return null;
    };

    const [currentIndex, setCurrentIndex] = useState(findFloorIndex(buildingName, roomName));

    const findRoomIndex = (buildingName: string, roomName: string): number | null => {
        const building = buildingsInfo[buildingName];
        if (!building) {
            console.log('Building not found');
            return null;
        }

        for (let floorIndex = 0; floorIndex < building.floors.length; floorIndex++) {
            const floor = building.floors[floorIndex];
            for (let roomIndex = 0; roomIndex < floor.rooms.length; roomIndex++) {
                const room = floor.rooms[roomIndex];
                if (room.name === roomName) {
                    return roomIndex;
                }
            }
        }

        console.log('Room not found in the building');
        return null;
    };

    roomIndex = findRoomIndex(buildingName, roomName);
    console.log('RoomInfo', buildingName, roomName, findFloorIndex(buildingName, roomName), findRoomIndex(buildingName, roomName));

    let functionBook = () => {
        const timeStartInput = document.getElementById("timeStart") as HTMLInputElement;
        const timeEndInput = document.getElementById("timeEnd") as HTMLInputElement;
            
        if (!timeStartInput.value || !timeEndInput.value || selectedDate === '') {
            alert(translations[language].roomInfo.alertCheck1);
            return;
        }
    
        if (timeStartInput.value >= timeEndInput.value) {
            alert(translations[language].roomInfo.alertCheck2);
            return;
        }

        if (selectedDate < new Date().toISOString().split('T')[0]) {
            alert(translations[language].roomInfo.alertCheck3);
            return;
        }

        const room = building.floors[currentIndex].rooms.find(room => room.name === roomName);
        if (room) {
            const hasConflict = room.reservations.some(reservation => {
                return reservation.date === selectedDate &&
                    ((timeStartInput.value >= reservation.time_start && timeStartInput.value < reservation.time_end) ||
                     (timeEndInput.value > reservation.time_start && timeEndInput.value <= reservation.time_end) ||
                     (timeStartInput.value <= reservation.time_start && timeEndInput.value >= reservation.time_end));
            });

            if (hasConflict) {
                alert(translations[language].roomInfo.alertCheck4);
                return;
            }

            const reservation = { date: selectedDate, time_start: timeStartInput.value, time_end: timeEndInput.value, user: "user_test" };
            building.floors[currentIndex].rooms[roomIndex].reservations.push(reservation);

            alert(translations[language].roomInfo.alertSuccess);
        }
    }

    const RoomCalendar = ({ selectedDate, setSelectedDate }: { selectedDate: string; setSelectedDate: React.Dispatch<React.SetStateAction<string>> }) => {
        const [value, onChange] = useState(new Date());

        const handleDateChange = (value: Date) => {
            onChange(value);
            setSelectedDate(value.toISOString().split('T')[0]);
        };
        return (
            <Calendar
                onChange={handleDateChange}
                value={selectedDate}
                minDate={new Date('2024-09-01')}
                maxDate={new Date('2024-12-31')}
                showNavigation={true}
                showNeighboringMonth={true}
                showWeekNumbers={false}
                locale={translations[language].roomInfo.calendarLocale}
            />
        )
    }

    const renderContent = () => {
        switch (selectedOption) {
            case translations[language].roomInfo.buttonRoomInfo:
                return <div className="rooms-list">
                    {building.floors[currentIndex].rooms.map((room, index) => {
                        if (room.name === roomName) {
                            return (
                                <div
                                    key={roomName}
                                    className="room-info-card"
                                >
                                    <div >
                                        <div style={{ display: 'flex', flexDirection: 'row' }}>
                                            <div style={{ flex: 1, alignContent: 'center' }}>
                                                <table style={{ alignContent: 'center' }}>
                                                    <tbody>
                                                        <tr>
                                                            <td>{translations[language].roomInfo.Description}</td>
                                                            <td>{room.description}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>{translations[language].roomInfo.Size}</td>
                                                            <td>{room.size}</td>
                                                        </tr>

                                                        {room.materials.map((material, index) => {
                                                            return (
                                                                index == 0 ? (
                                                                    <tr key={index}>
                                                                        <td>Material</td>
                                                                        <td>{material.number}x {material.name}</td>
                                                                    </tr>
                                                                ): (
                                                                    <tr key={index}>
                                                                        <td></td>
                                                                        <td>{material.number}x {material.name}</td>
                                                                    </tr>
                                                                )
                                                                
                                                            );
                                                        })}

                                                        {room.qualities.map((qlt, index) => {
                                                            return (
                                                                index == 0 ? (<tr key={index}>
                                                                    <td>{translations[language].roomInfo.Quality}</td>
                                                                    <td>{qlt}</td>
                                                                    </tr>
                                                                ) : (<tr key={index}>
                                                                    <td></td>
                                                                        <td>{qlt}</td>
                                                                    </tr>
                                                                )
                                                            );
                                                        })}

                                                    </tbody>
                                                </table>
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <img src={room.photos[1]} alt={room.name} style={{ width: '100%' }} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        }
                        return null;
                    })}
                </div>;
            case translations[language].roomInfo.buttonReservations:
                return building.floors[currentIndex].rooms.map((room, index) => {
                    if (room.name === roomName) {
                        const reservationsForSelectedDate = room.reservations.filter(reserve => reserve.date === selectedDate);
                        return (
                            <div key={index}>
                                <div className="reservations-container">
                                    <div className="calendar-container">
                                        <h2><RoomCalendar selectedDate={selectedDate} setSelectedDate={setSelectedDate}/></h2>
                                    </div>
                                    <div className="details-container">
                                        <h2>{translations[language].roomInfo.reservations}</h2>
                                        {reservationsForSelectedDate.length > 0 ? (
                                            <><p>{translations[language].roomInfo.reservationsForDate}</p>
                                            <table>
                                                <tbody>
                                                    <tr>
                                                        <th>{translations[language].roomInfo.timeStart}</th>
                                                        <th>{translations[language].roomInfo.timeEnd}</th>
                                                    </tr>
                                                    {reservationsForSelectedDate.map((reserve, index) => (
                                                        <tr key={index}>
                                                            <td>{reserve.time_start}</td>
                                                            <td>{reserve.time_end}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table></>
                                        ) : (
                                            <p>{translations[language].roomInfo.noReservations}</p>
                                        )}
                                    </div>
                                    <div className="details-container book-slot-container">
                                        <h2>{translations[language].roomInfo.bookYourSlot}</h2>
                                        <div className="book-slot">
                                            <div className="book-slot-row">
                                                <label>{translations[language].roomInfo.date}</label>
                                                <span>{selectedDate}</span>
                                            </div>
                                            <div className="book-slot-row">
                                                <label>{translations[language].roomInfo.timeStart}</label>
                                                <input type="time" id="timeStart" name="timeStart" />
                                            </div>
                                            <div className="book-slot-row">
                                                <label>{translations[language].roomInfo.timeEnd}</label>
                                                <input type="time" id="timeEnd" name="timeEnd" />
                                            </div>
                                            <div className="book-button-container">
                                                <button className="book-button" onClick={() => functionBook()}>{translations[language].roomInfo.buttonBook}</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    }
                    return null;
                });
            default:
                return null;
        }
    };

    return (
        <>
        <FloatingButton onClick={() => navigate(-1)} type={"back"} />
        <FloatingButton onClick={toggleAccount} type={"account"} />
        <FloatingButton onClick={() => {
        const language = languageJSON.language;
        languageJSON.language = language === "en" ? "pt" : "en";
        }} type={"language"} />
        {isAccountOpen ? <LoginRegisterPopup onClose={toggleAccount} /> : <></>}
        <div className={"centered-container"}><h1>{translations[language].roomInfo.building} {buildingName.toUpperCase()} {translations[language].roomInfo.room} {roomName}</h1></div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', flexDirection: 'row' }}>
                <div style={{ flex: 1}}>
                    <div className={"header"}><h1></h1></div>
                </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                <button
                    className={`buttons ${selectedButton === translations[language].roomInfo.buttonRoomInfo ? 'selected' : ''}`}
                    onClick={() => {
                        setSelectedOption(translations[language].roomInfo.buttonRoomInfo);
                        setSelectedButton(translations[language].roomInfo.buttonRoomInfo);
                    }}
                >
                    {translations[language].roomInfo.buttonRoomInfo}
                </button>
                <button
                    className={`buttons ${selectedButton === translations[language].roomInfo.buttonReservations ? 'selected' : ''}`}
                    onClick={() => {
                        setSelectedOption(translations[language].roomInfo.buttonReservations);
                        setSelectedButton(translations[language].roomInfo.buttonReservations);
                    }}
                >
                    {translations[language].roomInfo.buttonReservations}
                </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {renderContent()}
            </div>
            <div>

            </div>
        </div>
        </>
    );
};

export default RoomInfo;
