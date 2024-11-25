import React from "react";
import { useNavigate } from 'react-router-dom';
import { Typography, Button } from "@material-tailwind/react";
import { FlagIcon } from "@heroicons/react/24/solid";
import './Error.css';

const Error = () => {
    const navigate = useNavigate();

    const handleBackHome = () => {
        navigate('/');
    };

    return (
        <div className="error-container">
            <div className="error-content">
                <FlagIcon className="error-icon" />
                <Typography
                    variant="h1"
                    color="blue-gray"
                    className="error-title"
                >
                    Error 404
                </Typography>
                <Typography
                    className="error-subtitle"
                >
                    It looks like something went wrong.
                </Typography>
                <Typography className="error-message">
                    Don&apos;t worry, our team is already on it.
                </Typography>
                <Button className="error-button" onClick={handleBackHome}>
                    Return Home
                </Button>
            </div>
        </div>
    );
}

export default Error;