import React, { useState, ReactElement } from 'react';
import { CaptureData } from '@/utils/dataconverter';

interface captureID {
  key: string;
  folder: string;
  name: string;
}

interface CaptureObject extends captureID {
  data: CaptureData;
}

interface TracePickerProps {
  availableTraces: CaptureObject[];
  setter: Function;
}



export default function TracePicker({ availableTraces, setter }: TracePickerProps): ReactElement {

  const [selectedTraces, setSelectedTraces] = useState<CaptureObject[]>([]);

  const handleCheckboxChange = (capture: CaptureObject) => {
    setSelectedTraces((prev: CaptureObject[]): CaptureObject[] => {
      const exists = prev.some((item: CaptureObject): boolean => item.key === capture.key);
      return exists
        ? prev.filter((item: CaptureObject): boolean => item.key !== capture.key) // filter it out if it does
        : [...prev, capture]; // adds item if it does not exists
    });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const files: CaptureData[] = [];
    selectedTraces.forEach((item: CaptureObject): void => {
      const capture: CaptureData = {
        time: item.data.time
      };
      const remainingChannelNames: string[] = Object.keys(item.data).filter((ch: string): boolean => ch !== "time");
      remainingChannelNames.forEach((ch: string): void => {
        capture[`${item.folder}/${item.name.replace(/\.[^/.]+$/, "")}/${ch}`] = item.data[ch];
      });
      files.push({ ...capture });
    });
    setter((prev: CaptureData[]): CaptureData[] => [...files]);
  }




  return (
    <>
      <h2 className="bold text-xl underline">Loaded Traces:</h2>
      <form onSubmit={handleSubmit} >
        {
          availableTraces.length === 0 ? (<p>Select a capture!</p>) : (
            availableTraces.map((capture: CaptureObject, i: number): React.ReactElement => (
              <div key={i}>
                <h3 className="italic">{capture.folder}: {capture.name}</h3>
                {Object.keys(capture.data)
                  .filter((name: string): boolean => name !== "time")
                  .map((key: string, i: number): React.ReactElement => (
                    //<li key={i}>{key}</li>
                    <div key={i}>
                      <input
                        type="checkbox"
                        id={`${capture.folder}-${capture.name}-${key}`}
                        name={`${capture.folder}/${capture.name}`}
                        onChange={() => handleCheckboxChange(capture)}
                      />
                      <label htmlFor={`${capture.folder}-${capture.name}-${key}`}>{key}</label>
                    </div>
                  ))}
              </div>
            ))
          )
        }
        < button
          type="submit"
          className="bg-gray-500 hover:bg-gray-400 mx-4 px-4 py-1 rounded">
          Plot traces
        </button>
      </form >
    </>
  )
}
