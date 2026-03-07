import { useState, useRef, useEffect } from 'react';
import { MapPin, Loader2 } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

const LocationInput = ({ label, value, onChange, name = "address", placeholder = "e.g. Kollam", className, isTextArea = false, required = false }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const wrapperRef = useRef(null);
    const debounceTimer = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const fetchLocations = async (query) => {
        if (!query.trim()) {
            setSuggestions([]);
            setIsSearching(false);
            return;
        }

        try {
            // Use OpenStreetMap Nominatim API for geocoding
            const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`);
            const data = await res.json();

            // Format the display names to be a bit cleaner
            const formattedSuggestions = data.map(item => {
                const parts = item.display_name.split(', ');
                // Typically keep the first 3 parts for a cleaner UI (e.g. "Kollam, Kerala, India")
                return parts.slice(0, 3).join(', ');
            });

            // Remove exact duplicates that might arise from truncation
            setSuggestions([...new Set(formattedSuggestions)]);
        } catch (error) {
            console.error("Geocoding error:", error);
        } finally {
            setIsSearching(false);
        }
    };

    const handleInputChange = (e) => {
        const val = e.target.value;
        onChange(e); // Propagate up immediately so the input updates

        if (val.trim() && val.length > 2) {
            setIsOpen(true);
            setIsSearching(true);

            // Clear previous timer
            if (debounceTimer.current) clearTimeout(debounceTimer.current);

            // Debounce the API call to avoid spamming Nominatim
            debounceTimer.current = setTimeout(() => {
                fetchLocations(val);
            }, 500);
        } else {
            setSuggestions([]);
            setIsSearching(false);
            if (val.length === 0) setIsOpen(false);
        }
    };

    const handleSelect = (city) => {
        const syntheticEvent = {
            target: {
                name: name,
                value: city
            }
        };
        onChange(syntheticEvent);
        setIsOpen(false);
    };

    const inputClasses = twMerge(
        "w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all",
        isTextArea && "resize-none h-20",
        className
    );

    return (
        <div className="space-y-1 w-full" ref={wrapperRef}>
            {label && <label className="text-sm font-medium text-slate-700 block">{label}</label>}
            <div className="relative w-full">
                <MapPin className="absolute left-3 top-3.5 text-slate-400 pointer-events-none" size={18} />

                {isTextArea ? (
                    <textarea
                        name={name}
                        value={value}
                        onChange={handleInputChange}
                        onFocus={() => { if (value && suggestions.length > 0) setIsOpen(true) }}
                        placeholder={placeholder}
                        autoComplete="off"
                        className={inputClasses}
                        required={required}
                        rows="2"
                    />
                ) : (
                    <input
                        type="text"
                        name={name}
                        value={value}
                        onChange={handleInputChange}
                        onFocus={() => { if (value && suggestions.length > 0) setIsOpen(true) }}
                        placeholder={placeholder}
                        autoComplete="off"
                        className={inputClasses}
                        required={required}
                    />
                )}

                {isOpen && suggestions.length > 0 && (
                    <ul className="absolute z-[100] w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-48 overflow-y-auto custom-scrollbar">
                        {suggestions.map((city, index) => (
                            <li
                                key={index}
                                onClick={() => handleSelect(city)}
                                className="px-4 py-2 hover:bg-slate-50 cursor-pointer text-sm text-slate-700 font-medium border-b border-slate-50 last:border-0 flex items-center gap-2"
                            >
                                <MapPin size={14} className="text-brand-500 shrink-0" />
                                {city}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default LocationInput;
