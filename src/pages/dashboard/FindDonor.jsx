import { useState, useEffect } from 'react';
import { Search, MapPin, Filter, Star, Phone, Mail, Navigation } from 'lucide-react';
import Button from '../../components/common/Button';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';

// Import Leaflet components and CSS
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Create a custom marker icon so we don't rely on Leaflet's default image
const customMarkerIcon = new L.divIcon({
    className: 'custom-marker',
    html: `<div class="w-8 h-8 bg-brand-600 text-white rounded-full flex items-center justify-center border-2 border-white shadow-lg shadow-brand-500/50">
             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>
           </div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
});

const hospitalMarkerIcon = new L.divIcon({
    className: 'hospital-marker',
    html: `<div class="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center border-2 border-white shadow-lg shadow-blue-500/50">
             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a4 4 0 0 0-4 4v2H7a4 4 0 0 0-4 4v9h18v-9a4 4 0 0 0-4-4h-3V6a4 4 0 0 0-4-4Z"></path><path d="M12 18v-4"></path><path d="M10 16h4"></path></svg>
           </div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
});

// Haversine formula to calculate distance between two coordinates
const calculateDistance = (lat1, lon1, lat2, lon2) => {
    if (!lat1 || !lon1 || !lat2 || !lon2) return null;
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c).toFixed(1); // Distance in km
};

const FindDonor = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('list'); // 'list' or 'map'
    const [donors, setDonors] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedBloodGroup, setSelectedBloodGroup] = useState('');
    const [userLocationCoords, setUserLocationCoords] = useState(null);
    const { addToast } = useToast();

    // Central map location (Defaulting to Kollam, Kerala)
    const mapCenter = [8.8932, 76.6141];

    const fetchDonors = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('access_token');
            let url = `${import.meta.env.VITE_API_URL}/api/auth/donors/`;
            if (selectedBloodGroup) {
                url += `?blood_group=${encodeURIComponent(selectedBloodGroup)}`;
            }

            const response = await fetch(url, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                const data = await response.json();

                // Use Nominatim API to geocode addresses
                const geocodeAddress = async (address) => {
                    if (!address || address === 'Location unknown' || address === 'None') return null;
                    try {
                        // Add a small delay to respect Nominatim's rate limits
                        await new Promise(resolve => setTimeout(resolve, 300));
                        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`);
                        const geoData = await res.json();
                        if (geoData && geoData.length > 0) {
                            return [parseFloat(geoData[0].lat), parseFloat(geoData[0].lon)];
                        }
                    } catch (error) {
                        console.error("Geocoding failed for", address, error);
                    }
                    return null;
                };

                // 1. First, geocode the logged in user's hospital/org address if available
                let cachedUserCoords = userLocationCoords;
                if (!cachedUserCoords && user?.address) {
                    cachedUserCoords = await geocodeAddress(user.address);
                    if (cachedUserCoords) {
                        setUserLocationCoords(cachedUserCoords);
                    }
                }

                // Create an array of promises for geocoding all donors concurrently
                const donorsWithLocationPromises = data.map(async (donor, index) => {
                    let coords = await geocodeAddress(donor.address);

                    // Fallback to random offset near center if address not found
                    if (!coords) {
                        const offsetLat = (index % 10) * 0.01 - 0.05;
                        const offsetLng = (index % 7) * 0.01 - 0.03;
                        coords = [mapCenter[0] + offsetLat, mapCenter[1] + offsetLng];
                    }

                    // Calculate precise distance from the hospital if coords are known
                    let distance = "Unknown";
                    if (cachedUserCoords && coords) {
                        distance = calculateDistance(cachedUserCoords[0], cachedUserCoords[1], coords[0], coords[1]) + " km away";
                    }

                    return {
                        ...donor,
                        dist: distance !== "Unknown" ? distance : "Nearby",
                        coordinates: coords
                    };
                });

                // Wait for all geocoding to finish
                const resolvedDonors = await Promise.all(donorsWithLocationPromises);
                setDonors(resolvedDonors);
            } else {
                addToast("Failed to fetch donors", "error");
            }
        } catch (error) {
            addToast("Network error while fetching donors", "error");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchDonors();
    }, [selectedBloodGroup]);

    return (
        <div className="h-[calc(100vh-8rem)] flex flex-col">
            {/* Header & Filters */}
            <div className="mb-6 space-y-4 flex-shrink-0">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Donor Directory</h1>
                        <p className="text-slate-500">Locate and contact verified blood donors in your area.</p>
                    </div>

                    <div className="flex bg-slate-100 p-1 rounded-lg">
                        <button onClick={() => setActiveTab('list')} className={`px-4 py-2 rounded-md text-sm font-semibold transition-all ${activeTab === 'list' ? 'bg-white text-brand-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>List View</button>
                        <button onClick={() => setActiveTab('map')} className={`px-4 py-2 rounded-md text-sm font-semibold transition-all ${activeTab === 'map' ? 'bg-white text-brand-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Map View</button>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input type="text" placeholder="Search by name or location..." className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all shadow-sm" />
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
                        {['All', 'A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(bg => (
                            <button
                                key={bg}
                                onClick={() => setSelectedBloodGroup(bg === 'All' ? '' : bg)}
                                className={`px-4 py-2.5 rounded-xl border text-sm font-bold whitespace-nowrap transition-all ${(selectedBloodGroup === bg || (bg === 'All' && selectedBloodGroup === ''))
                                    ? 'bg-brand-50 border-brand-200 text-brand-700'
                                    : 'bg-white border-slate-200 text-slate-600 hover:border-brand-300'
                                    }`}
                            >
                                {bg}
                            </button>
                        ))}
                    </div>
                    <Button variant="outline" className="px-3 shrink-0 bg-white"><Filter size={18} /></Button>
                </div>
            </div>

            {/* Main Content Area (Split View) */}
            <div className="flex-1 flex gap-6 min-h-0">

                {/* LEFT: Donor List */}
                <div className={`w-full ${activeTab === 'list' ? 'lg:w-1/2' : 'hidden lg:flex lg:w-1/3'} flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar`}>
                    {isLoading ? (
                        <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin"></div></div>
                    ) : donors.length === 0 ? (
                        <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
                            <p className="text-slate-500">No donors found for this criteria.</p>
                        </div>
                    ) : (
                        donors.map(donor => (
                            <div key={donor.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-brand-300 transition-all group cursor-pointer" onClick={() => { if (activeTab === 'list') setActiveTab('map') }}>
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <img src={`https://ui-avatars.com/api/?name=${donor.name}&background=f8fafc&color=0f172a`} alt={donor.name} className="w-12 h-12 rounded-full border border-slate-100" />
                                        <div>
                                            <h3 className="font-bold text-slate-800">{donor.name}</h3>
                                            <div className="flex items-center gap-1 text-xs font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md w-fit mt-1">
                                                <Star size={12} className="fill-amber-600" /> Trust Score: {donor.trust_score}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 font-bold flex items-center justify-center border border-brand-100">
                                        {donor.blood_group}
                                    </div>
                                </div>

                                <div className="space-y-2 mb-4">
                                    <p className="text-sm text-slate-600 flex items-center gap-2">
                                        <MapPin size={16} className="text-slate-400" />
                                        <span>{donor.address || 'Location unknown'} &bull; <span className="text-brand-600 font-semibold">{donor.dist}</span></span>
                                    </p>
                                    <p className="text-sm text-slate-600 flex items-center gap-2"><Phone size={16} className="text-slate-400" /> {donor.phone || 'No phone provided'}</p>
                                </div>

                                <div className="flex gap-2 pt-4 border-t border-slate-100">
                                    <Button variant="outline" className="flex-1 text-sm py-2"><Mail size={16} /> Message</Button>
                                    <Button className="flex-1 text-sm py-2"><Navigation size={16} /> Navigate</Button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* RIGHT: Live Map Area */}
                <div className={`${activeTab === 'map' ? 'block' : 'hidden lg:block'} flex-1 rounded-2xl border border-slate-300 overflow-hidden relative shadow-sm z-0`}>
                    <MapContainer center={mapCenter} zoom={12} scrollWheelZoom={true} className="w-full h-full z-0">
                        {/* Free, open-source map tiles from OpenStreetMap */}
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />

                        {/* Plotting the Hospital/User Location */}
                        {!isLoading && userLocationCoords && (
                            <Marker position={userLocationCoords} icon={hospitalMarkerIcon}>
                                <Popup className="rounded-xl">
                                    <div className="p-1">
                                        <h3 className="font-bold text-blue-900 text-lg m-0">Your Location</h3>
                                        <p className="text-sm text-slate-600 flex items-center gap-1 mb-1 mt-1"><MapPin size={12} /> {user?.address}</p>
                                    </div>
                                </Popup>
                            </Marker>
                        )}

                        {/* Plotting the Donors */}
                        {!isLoading && donors.map(donor => (
                            <Marker key={donor.id} position={donor.coordinates} icon={customMarkerIcon}>
                                <Popup className="rounded-xl">
                                    <div className="p-1">
                                        <div className="flex items-center justify-between gap-4 mb-2">
                                            <h3 className="font-bold text-slate-900 text-lg m-0">{donor.name}</h3>
                                            <span className="bg-brand-100 text-brand-700 font-bold px-2 py-1 rounded text-xs">{donor.blood_group}</span>
                                        </div>
                                        <p className="text-sm text-slate-600 flex items-center gap-1 mb-1"><Phone size={12} /> {donor.phone}</p>
                                        <p className="text-sm text-slate-600 flex items-center gap-1 mb-1"><MapPin size={12} /> {donor.address}</p>
                                        <p className="text-sm text-brand-600 font-semibold mb-3">{donor.dist}</p>
                                        <Button className="w-full text-xs py-1.5"><Navigation size={14} className="mr-1" /> Route to Donor</Button>
                                    </div>
                                </Popup>
                            </Marker>
                        ))}
                    </MapContainer>
                </div>

            </div>
        </div>
    );
};

export default FindDonor;