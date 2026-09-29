    mapboxgl.accessToken=mapToken;
    console.log(coordinates);
    const map = new mapboxgl.Map({
        container : 'map', // container ID
        style : "mapbox://styles/mapbox/satellite-streets-v12",
        center: (coordinates), // starting position [lng, lat]. Note that lat must be set between -90 and 90
        zoom: 15 // starting zoom
    });

    const marker1 = new mapboxgl.Marker({color : "red"})
        .setLngLat(coordinates)
        .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(
        'Exact Location will be Provided after booking!'
    ))
        .addTo(map);
