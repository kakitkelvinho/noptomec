import { useState } from 'react';

export default function JsonUpload() {
  const [jsonData, setJsonData] = useState(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/json') {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const data = JSON.parse(reader.result);
          setJsonData(data); // Save the parsed JSON data to state
        } catch (error) {
          console.error('Error parsing JSON:', error);
          alert('Failed to parse JSON!');
        }
      };
      reader.readAsText(file);
    } else {
      alert('Please upload a valid JSON file!');
    }
  };

  return (
    <div>
      <h1>Upload and Display JSON</h1>
      <input type="file" accept="application/json" onChange={handleFileUpload} />
      {jsonData && (
        <div>
          <h2>Parsed Data:</h2>
          <pre>{JSON.stringify(jsonData, null, 2)}</pre> {/* Display the uploaded JSON */}
          {/* Here you can use jsonData for further processing, like plotting */}
        </div>
      )}
    </div>
  );
}
