import React, { useState } from 'react';
import { supabase } from './supabase-config'; // Import our new Supabase client

const UploadForm = () => {
    // State for all the new fields matching your Supabase table
    const [artworkId, setArtworkId] = useState('');
    const [title, setTitle] = useState('');
    const [artistName, setArtistName] = useState('');
    const [year, setYear] = useState('');
    const [price, setPrice] = useState('');
    const [currency, setCurrency] = useState('SGD');
    const [sizeWidth, setSizeWidth] = useState('');
    const [sizeHeight, setSizeHeight] = useState('');
    const [sizeUnit, setSizeUnit] = useState('cm');
    const [tags, setTags] = useState('');
    const [story, setStory] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [audioStoryUrl, setAudioStoryUrl] = useState('');
    const [status, setStatus] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('Submitting...');

        // 1. Prepare the data object that matches your Supabase table columns
        const artworkData = {
            artwork_id: artworkId,
            title: title,
            artistName: artistName,
            year: year ? parseInt(year) : null,
            price: price ? parseFloat(price) : null,
            currency: currency,
            size_width: sizeWidth ? parseInt(sizeWidth) : null,
            size_height: sizeHeight ? parseInt(sizeHeight) : null,
            size_unit: sizeUnit,
            tags: tags.split(',').map(tag => tag.trim()),
            story: story,
            imageUrl: imageUrl,
            audioStoryUrl: audioStoryUrl,
        };

        // 2. Insert the data into the 'artworks' table in Supabase
        const { data, error } = await supabase
            .from('artworks')
            .insert([artworkData]);

        // 3. Handle the response
        if (error) {
            console.error('Error inserting data:', error);
            setStatus(`Error: ${error.message}`);
        } else {
            setStatus('Artwork successfully uploaded to Supabase!');
            console.log('Inserted data:', data);
            // Reset form
            setArtworkId('');
            setTitle('');
            setArtistName('');
            setYear('');
            setPrice('');
            setCurrency('SGD');
            setSizeWidth('');
            setSizeHeight('');
            setSizeUnit('cm');
            setTags('');
            setStory('');
            setImageUrl('');
            setAudioStoryUrl('');
        }
    };

    // Basic styling
    const formStyle = { fontFamily: 'sans-serif', padding: '2em', maxWidth: '600px', margin: 'auto' };
    const divStyle = { marginBottom: '1em' };
    const labelStyle = { display: 'block', marginBottom: '0.5em', fontWeight: 'bold' };
    const inputStyle = { width: '100%', padding: '0.8em', boxSizing: 'border-box' };
    const sizeDivStyle = { display: 'flex', gap: '10px' };

    return (
        <div style={formStyle}>
            <h1>Upload Artwork to Supabase</h1>
            <form onSubmit={handleSubmit}>
                <div style={divStyle}>
                    <label style={labelStyle}>Artwork ID (e.g., art_123)</label>
                    <input style={inputStyle} type="text" value={artworkId} onChange={(e) => setArtworkId(e.target.value)} required />
                </div>
                <div style={divStyle}>
                    <label style={labelStyle}>Title</label>
                    <input style={inputStyle} type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
                </div>
                <div style={divStyle}>
                    <label style={labelStyle}>Artist Name</label>
                    <input style={inputStyle} type="text" value={artistName} onChange={(e) => setArtistName(e.target.value)} required />
                </div>
                <div style={divStyle}>
                    <label style={labelStyle}>Year</label>
                    <input style={inputStyle} type="number" value={year} onChange={(e) => setYear(e.target.value)} />
                </div>
                <div style={sizeDivStyle}>
                    <div style={{ flex: 1 }}>
                        <label style={labelStyle}>Price</label>
                        <input style={inputStyle} type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
                    </div>
                    <div style={{ flex: 1 }}>
                        <label style={labelStyle}>Currency</label>
                        <input style={inputStyle} type="text" value={currency} onChange={(e) => setCurrency(e.target.value)} />
                    </div>
                </div>
                <label style={labelStyle}>Size</label>
                <div style={sizeDivStyle}>
                    <input style={inputStyle} type="number" placeholder="Width" value={sizeWidth} onChange={(e) => setSizeWidth(e.target.value)} />
                    <input style={inputStyle} type="number" placeholder="Height" value={sizeHeight} onChange={(e) => setSizeHeight(e.target.value)} />
                    <input style={inputStyle} type="text" placeholder="Unit" value={sizeUnit} onChange={(e) => setSizeUnit(e.target.value)} />
                </div>
                <div style={divStyle}>
                    <label style={labelStyle}>Tags (comma-separated)</label>
                    <input style={inputStyle} type="text" value={tags} onChange={(e) => setTags(e.target.value)} />
                </div>
                <div style={divStyle}>
                    <label style={labelStyle}>Story</label>
                    <textarea style={inputStyle} rows="4" value={story} onChange={(e) => setStory(e.target.value)}></textarea>
                </div>
                <div style={divStyle}>
                    <label style={labelStyle}>Image URL</label>
                    <input style={inputStyle} type="text" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} required />
                </div>
                <div style={divStyle}>
                    <label style={labelStyle}>Audio Story URL</label>
                    <input style={inputStyle} type="text" value={audioStoryUrl} onChange={(e) => setAudioStoryUrl(e.target.value)} />
                </div>
                <button type="submit" style={{ padding: '1em 2em', width: '100%', cursor: 'pointer' }}>Submit Artwork</button>
            </form>
            {status && <p style={{ marginTop: '1em', fontWeight: 'bold' }}>Status: {status}</p>}
        </div>
    );
};

export default UploadForm;