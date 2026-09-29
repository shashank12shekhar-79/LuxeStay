const sampleListings = [
  {
    title: "Modern Apartment in Kolkata",
    description: "A comfortable modern apartment located in the heart of Kolkata.",
    image: {
      url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267",
      filename: "kolkata-apartment"
    },
    price: 4500,
    location: {
      houseNumber: "24",
      street: "Park Street",
      locality: "Park Street Area",
      city: "Kolkata",
      state: "West Bengal",
      country: "India",
      pincode: 700016
    },
    geometry: {
      type: "Point",
      coordinates: [88.3522, 22.5535]
    },
    category: "Iconic cities"
  },

  {
    title: "Peaceful Villa in Goa",
    description: "A beautiful private villa surrounded by greenery near the beach.",
    image: {
      url: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6",
      filename: "goa-villa"
    },
    price: 8500,
    location: {
      houseNumber: "18",
      street: "Candolim Road",
      locality: "Candolim",
      city: "North Goa",
      state: "Goa",
      country: "India",
      pincode: 403515
    },
    geometry: {
      type: "Point",
      coordinates: [73.7625, 15.5186]
    },
    category: "Amazing pools"
  },

  {
    title: "Mountain View Cottage",
    description: "A cozy cottage with beautiful mountain views and a peaceful environment.",
    image: {
      url: "https://images.unsplash.com/photo-1510798831971-661eb04b3739",
      filename: "mountain-cottage"
    },
    price: 5200,
    location: {
      houseNumber: "12",
      street: "Mall Road",
      locality: "Manali",
      city: "Manali",
      state: "Himachal Pradesh",
      country: "India",
      pincode: 175131
    },
    geometry: {
      type: "Point",
      coordinates: [77.1887, 32.2396]
    },
    category: "Mountains"
  },

  {
    title: "Luxury Room in Mumbai",
    description: "Premium private room close to major attractions and business areas.",
    image: {
      url: "https://images.unsplash.com/photo-1566665797739-1674de7a421a",
      filename: "mumbai-room"
    },
    price: 6000,
    location: {
      houseNumber: "45",
      street: "Linking Road",
      locality: "Bandra West",
      city: "Mumbai",
      state: "Maharashtra",
      country: "India",
      pincode: 400050
    },
    geometry: {
      type: "Point",
      coordinates: [72.8296, 19.0607]
    },
    category: "Rooms"
  },

  {
    title: "Beautiful Farm Stay",
    description: "Relaxing farm stay surrounded by nature, perfect for a weekend getaway.",
    image: {
      url: "https://images.unsplash.com/photo-1500382017468-9049fed747ef",
      filename: "farm-stay"
    },
    price: 3800,
    location: {
      houseNumber: "7",
      street: "Village Road",
      locality: "Devanahalli",
      city: "Bangalore",
      state: "Karnataka",
      country: "India",
      pincode: 562110
    },
    geometry: {
      type: "Point",
      coordinates: [77.5963, 13.2475]
    },
    category: "Farms"
  },

  {
    title: "Royal Heritage Castle",
    description: "Experience traditional architecture and royal interiors in this heritage property.",
    image: {
      url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c",
      filename: "heritage-castle"
    },
    price: 12000,
    location: {
      houseNumber: "1",
      street: "Fort Road",
      locality: "Amber",
      city: "Jaipur",
      state: "Rajasthan",
      country: "India",
      pincode: 302028
    },
    geometry: {
      type: "Point",
      coordinates: [75.8513, 26.9855]
    },
    category: "Castles"
  }
];

module.exports = { data: sampleListings };