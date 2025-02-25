import React, { useState, ReactElement, useContext } from 'react';
import { CaptureData } from '@/utils/dataconverter';
import { FilesContext } from './filescontext';

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
}



export default function TracePicker({ availableTraces }: TracePickerProps): ReactElement {

  const [selectedTraces, setSelectedTraces] = useState<CaptureObject[]>([]);

  const filesContext = useContext(FilesContext);
  if (!filesContext) throw new Error("useContext must be used within a FilesProvider");
  const { setFiles } = filesContext;


  const handleCheckboxChange = (capture: CaptureObject, key: string) => {
    // capture contains the original object with ALL data
    // key -- what is toggled by the checkbox
    // Compare data in capture with the key and update object
    setSelectedTraces((prev: CaptureObject[]): CaptureObject[] => {
      const newTraces = [...prev];
      const search = newTraces.find((item: CaptureObject) => item.key === capture.key);

      if (search) {
        // item exists
        const updatedData = { ...search.data }; // old data
        if (updatedData[key]) {
          delete updatedData[key];
        } else {
          updatedData[key] = capture.data[key];
        }
        return newTraces.map((item: CaptureObject): CaptureObject =>
          item.key === capture.key ? { ...item, data: updatedData } : item
        );
      } else {
        return [...prev,
        {
          ...capture,
          data: {
            time: capture.data.time,
            key: capture.data[key]
          }
        }];
      }
    });

    //  const updatedCapture = prev.map((item: CaptureObject) => {
    //    // find object in question
    //    if (item.key === capture.key) {
    //      const updatedData = { ...item.data };
    //      const originalCapture = availableTraces
    //        .find((item: CaptureObject) => item.key === capture.key)?.data;


    //      updatedData[key]
    //        ? (delete updatedData[key])
    //        : (updatedData[key])


    //    }
    //  })
    //})

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
    setFiles([...files]);
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
                        onChange={() => handleCheckboxChange(capture, key)}
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
