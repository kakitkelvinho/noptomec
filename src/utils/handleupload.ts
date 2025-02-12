import React from 'react';

export function onUpload(event, setJsonData) {
  // alert("Thanks!");
  const file = event.target.files?.[0];
  if (file) {
    const reader = new FileReader();

    reader.onload = () => {
      try {
        const parsedData = JSON.parse(reader.result as string);
        console.log("Parsed data: ", parsedData);
        setJsonData(parsedData);
      } catch (error) {
        console.error("Error parsing file: ", error);
        alert("Sorry! Unable to read file!");
      }
    }

    reader.readAsText(file);
  };
}
