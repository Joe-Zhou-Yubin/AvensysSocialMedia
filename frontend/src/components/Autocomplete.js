import React, { useState } from 'react';
import axios from 'axios';

const Autocomplete = () => {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const handleInputChange = (event) => {
    const value = event.target.value;
    setInputValue(value);

    // Fetch suggestions from the backend when the input value changes
    axios.get(`/suggestions?query=${value}`)
      .then((response) => {
        setSuggestions(response.data);
      })
      .catch((error) => {
        console.error('Error fetching suggestions:', error);
      });
  };

  return (
    <div>
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder="Search for a username..."
      />
      <ul>
        {suggestions.map((suggestion) => (
          <li key={suggestion}>{suggestion}</li>
        ))}
      </ul>
    </div>
  );
};

export default Autocomplete;
