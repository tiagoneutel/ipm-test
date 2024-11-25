import React from 'react';
import './CustomDropdown.css';

interface CustomDropdownProps {
    options: string[];
    selectedOptions: string[];
    onChange: (selectedOptions: string[]) => void;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({ options, selectedOptions, onChange }) => {
    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        const newSelectedOptions = event.target.checked
            ? [...selectedOptions, value]
            : selectedOptions.filter(option => option !== value);
        onChange(newSelectedOptions);
    };

    return (
        <div className="custom-dropdown">
            {options.map((option, index) => (
                <label key={index}>
                    <input
                        type="checkbox"
                        value={option}
                        checked={selectedOptions.includes(option)}
                        onChange={handleCheckboxChange}
                    />
                    {option}
                </label>
            ))}
        </div>
    );
};

export default CustomDropdown;