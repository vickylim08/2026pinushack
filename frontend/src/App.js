import './App.css';
import Auth from './Auth';
import Gallery from './Gallery'; // Import the new Gallery component
import UploadForm from './UploadForm';

function App() {
  return (
    <div className="App">
      <Gallery />
      <hr />
      <details style={{ cursor: 'pointer', maxWidth: '640px', margin: '2em auto', border: '1px solid #eee', padding: '1em', borderRadius: '8px' }}>
        <summary style={{ fontWeight: 'bold' }}>Admin & Upload Section</summary>
        <div style={{marginTop: '1em'}}>
          <Auth />
          <UploadForm />
        </div>
      </details>
    </div>
  );
}

export default App;
