const axios = require('axios');
const config = require('../../config/config');

class FoodLocationScraper {
    constructor() {
        this.googleMapsApiKey = config.googleMapsApiKey;
        this.universityLocation = {
            lat: -7.2857972169713605,  // Universitas Ciputra latitude
            lng: 112.63201835315475   // Universitas Ciputra longitude
        };
    }

    async searchNearbyFood(radius = 1000) { // radius in meters (2km default)
        try {
            // Search for restaurants
            const restaurantResponse = await axios.get(
                `https://maps.googleapis.com/maps/api/place/nearbysearch/json`,
                {
                    params: {
                        location: `${this.universityLocation.lat},${this.universityLocation.lng}`,
                        radius: radius,
                        type: 'restaurant',
                        keyword: 'tempat makan|restaurant|rumah makan|warung|food court',
                        language: 'id',
                        key: this.googleMapsApiKey
                    }
                }
            );

            // Search for cafes
            const cafeResponse = await axios.get(
                `https://maps.googleapis.com/maps/api/place/nearbysearch/json`,
                {
                    params: {
                        location: `${this.universityLocation.lat},${this.universityLocation.lng}`,
                        radius: radius,
                        type: 'cafe',
                        keyword: 'cafe|coffee shop|milk tea|boba',
                        language: 'id',
                        key: this.googleMapsApiKey
                    }
                }
            );

            const allPlaces = [...restaurantResponse.data.results, ...cafeResponse.data.results];
            
            // Remove duplicates based on place_id
            const uniquePlaces = Array.from(new Map(allPlaces.map(place => [place.place_id, place])).values());
            
            const detailedResults = await Promise.all(
                uniquePlaces.map(place => this.getPlaceDetails(place.place_id))
            );

            return {
                status: 'success',
                foodLocations: detailedResults.map(place => ({
                    name: place.name,
                    type: this.determineLocationType(place),
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
                    priceLevel: this.getPriceRange(place.price_level),
                    openNow: place.opening_hours?.open_now,
                    openingHours: place.opening_hours?.weekday_text || [],
                    url: place.url, // Google Maps URL
                    cuisine: place.types?.filter(type => 
                        !['restaurant', 'food', 'point_of_interest', 'establishment'].includes(type)
                    ) || [],
                    popularTimes: place.popular_times || null
                }))
            };
        } catch (error) {
            console.error('Error searching nearby food locations:', error);
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
                        fields: 'name,type,formatted_address,formatted_phone_number,geometry,rating,' +
                               'user_ratings_total,photos,price_level,opening_hours,url,types',
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

    determineLocationType(place) {
        if (place.types?.includes('cafe')) return 'Cafe';
        if (place.types?.includes('restaurant')) return 'Restaurant';
        return 'Food Place';
    }

    getPriceRange(priceLevel) {
        const priceRanges = {
            0: 'Murah (< Rp25rb)',
            1: 'Terjangkau (Rp25rb - Rp50rb)',
            2: 'Moderate (Rp50rb - Rp100rb)',
            3: 'Mahal (Rp100rb - Rp200rb)',
            4: 'Very Expensive (> Rp200rb)'
        };
        return priceRanges[priceLevel] || 'Informasi harga tidak tersedia';
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

module.exports = new FoodLocationScraper();