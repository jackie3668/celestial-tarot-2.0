import React, { useState, useEffect, useRef } from 'react';
import './Spread.css';
import arrow from '../../assets/ui/down-arrow.png';

const Spread = ({ setSpread }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState('Select a spread');
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleItemClick = (item) => {
    setSelectedItem(item);
    setSpread(item)
    setIsOpen(false);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const items = [
    'Three Card',
    'Five Card',
    'Yes or No',
    'Celtic Cross',
    'Horseshoe',
    'Relationship'
  ];

  return (
    <div className="spread-container" ref={dropdownRef}>
      <div className="dropdown">
        <div className={`dropdown-header glass ${isOpen ? 'open' : ''} ${selectedItem !== 'Select a spread' ? 'selected' : ''}`} onClick={toggleDropdown}>
          {selectedItem}
          <img src={arrow} className={isOpen ? 'open' : ''} alt="" />
        </div>
        {isOpen && (
          <div className="dropdown-list glass">
            {items.map((item, index) => (
              <div 
                key={index} 
                className="dropdown-item" 
                onClick={() => handleItemClick(item)}
              >
                {item}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Spread;
