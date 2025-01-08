const axios = require('axios');
const config = require('../../config/config');

class KosLocationScraper {
    constructor() {
        this.googleMapsApiKey = config.googleMapsApiKey;
        this.universityLocation = {
            lat: -7.2857972169713605,  // Universitas Ciputra latitude
            lng: 112.63201835315475  // Universitas Ciputra longitude
        };
    }

    async searchNearbyKos(radius = 2000) { // radius in meters (2km default)
        try {
            const response = await axios.get(
                `https://maps.googleapis.com/maps/api/place/nearbysearch/json`,
                {
                    params: {
                        location: `${this.universityLocation.lat},${this.universityLocation.lng}`,
                        radius: radius,
                        keyword: 'kos|kost|boarding house',
                        language: 'id',
                        key: this.googleMapsApiKey
                    }
                }
            );

            const places = response.data.results;
            const detailedResults = await Promise.all(
                places.map(place => this.getPlaceDetails(place.place_id))
            );

            return {
                status: 'success',
                kosLocations: detailedResults.map(place => ({
                    name: place.name,
                    address: place.formatted_address,
                    phone: place.formatted_phone_number || 'Tidak tersedia',
                    rating: place.rating || 'Belum ada rating',
                    totalReviews: place.user_ratings_total || 0,
                    location: {
                        lat: place.geometry.location.lat,
                        lng: place.geometry.location.lng
                    },
                    distance: this.calculateDistance(
                        this.universityLocation.lat,
                        this.universityLocation.lng,
                        place.geometry.location.lat,
                        place.geometry.location.lng
                    ),
                    photos: place.photos ? 
                        place.photos.slice(0, 3).map(photo => ({
                            url: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo.photo_reference}&key=${this.googleMapsApiKey}`
                        })) : [],
                    priceLevel: place.price_level || 'Tidak tersedia',
                    openNow: place.opening_hours?.open_now,
                    url: place.url // Google Maps URL
                }))
            };
        } catch (error) {
            console.error('Error searching nearby kos:', error);
            throw error;
        }
    }

    async getPlaceDetails(placeId) {
        try {
            const response = await axios.get(
                'https://maps.googleapis.com/maps/api/place/details/json',
                {
                    params: {
                        place_id: placeId,
                        fields: 'name,formatted_address,formatted_phone_number,geometry,rating,user_ratings_total,photos,price_level,opening_hours,url',
                        language: 'id',
                        key: this.googleMapsApiKey
                    }
                }
            );
            return response.data.result;
        } catch (error) {
            console.error('Error getting place details:', error);
            throw error;
        }
    }

    calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371; // Earth's radius in kilometers
        const dLat = this.deg2rad(lat2 - lat1);
        const dLon = this.deg2rad(lon2 - lon1);
        const a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
            Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        const distance = R * c; // Distance in kilometers
        return Math.round(distance * 100) / 100;
    }

    deg2rad(deg) {
        return deg * (Math.PI/180);
    }
}

module.exports = new KosLocationScraper();