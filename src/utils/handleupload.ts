"use client";
import React from 'react';

export function onUpload<T>(event: React.ChangeEvent<HTMLInputElement>, setFiles: React.Dispatch<React.SetStateAction<T[]>>): void {
  // alert("Thanks!");
  const files = event.target.files;
  if (!files) return;

  const fileReaders = Array.from(files).map(file => {
    return new Promise<T>((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        try {
          const parsedData = JSON.parse(reader.result as string);
          resolve(parsedData);
        } catch (error) {
          console.error(`Error parsing ${file.name} due to `, error);
          reject(error);
        }
      };
      reader.readAsText(file);
    });
  });

  Promise.all(fileReaders)
    .then((allData: T[]): void => {
      setFiles(allData);
    })
    .catch(() => {
      alert("One or more files could not be read!");
    });
}
