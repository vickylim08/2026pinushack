import React, { useState, useEffect } from 'react';
import { supabase } from './supabase-config';

const Gallery = () => {
    const [artworks, setArtworks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // This function fetches the artworks from Supabase
        const getArtworks = async () => {
            setLoading(true);

            // Select all rows from the 'artworks' table
            const { data, error } = await supabase
                .from('artworks')
                .select('*');

            if (error) {
                console.error('Error fetching artworks:', error);
                setError(error.message);
            } else {
                setArtworks(data);
            }

            setLoading(false);
        };

        getArtworks();
    }, []); // The empty array [] means this effect runs only once on mount

    // --- Styling ---
    const galleryStyle = {
        padding: '2em',
        textAlign: 'center'
    };
    const gridStyle = {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '2em',
        marginTop: '2em'
    };
    const cardStyle = {
        border: '1px solid #eee',
        borderRadius: '8px',
        padding: '1em',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
    };
    const imageStyle = {
        width: '100%',
        height: '200px',
        objectFit: 'cover',
        borderRadius: '4px'
    };
    const titleStyle = {
        fontSize: '1.2em',
        fontWeight: 'bold',
        marginTop: '0.5em'
    };
    const artistStyle = {
        color: '#555',
        marginBottom: '1em'
    };

    // --- Conditional Rendering ---
    if (loading) {
        return <div style={galleryStyle}><h2>Loading Gallery...</h2></div>;
    }

    if (error) {
        return <div style={galleryStyle}><h2 style={{color: 'red'}}>Error: {error}</h2></div>;
    }

    return (
        <div style={galleryStyle}>
            <h1>Virtual Art Gallery</h1>
            <p>Displaying {artworks.length} artworks from the database.</p>
            <div style={gridStyle}>
                {artworks.map(art => (
                    <div key={art.id} style={cardStyle}>
                        <img src={art.imageUrl} alt={art.title} style={imageStyle} />
                        <div style={titleStyle}>{art.title} ({art.year})</div>
                        <div style={artistStyle}>by {art.artistName}</div>
                        <div>{art.currency} {art.price}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Gallery;
