import React, { ReactElement, useState } from "react";
import { CaptureData } from "@/utils/dataconverter";

interface captureID {
  key: string;
  folder: string;
  name: string;
}

interface CaptureObject extends captureID {
  data: CaptureData;
}

interface CapturePickerProps {
  availableCaptures: captureID[];
  setAvailableTraces: React.Dispatch<React.SetStateAction<CaptureObject[]>>;
  username: string;
  repo: string;
}

export default function CapturePicker({
  availableCaptures,
  setAvailableTraces,
  username,
  repo,
}: CapturePickerProps): ReactElement {
  const [selectedCaptures, setSelectedCaptures] = useState<captureID[]>([]);

  const selectCapture = async (event: React.FormEvent): Promise<void> => {
    event.preventDefault();
    try {
      const traces: CaptureObject[] = [];
      selectedCaptures.forEach(async (capture: captureID): Promise<void> => {
        const response = await fetch(
          `https://cdn.jsdelivr.net/gh/${username}/${repo}@main/${capture.folder}/${capture.name}`,
        );
        const data = await response.json();
        traces.push({
          ...capture,
          data: data,
        });
        setAvailableTraces(traces);
      });
    } catch (error) {
      console.log("Error", error);
    }
  };

  const handleCaptureCheckboxChange = (capture: captureID) => {
    setSelectedCaptures((prev: captureID[]): captureID[] => {
      const exists = prev.some((item: captureID) => item.key === capture.key);
      return exists
        ? prev.filter((item: captureID): boolean => item.key !== capture.key) // filter it out if it does
        : [...prev, capture]; // adds item if it does not exists
    });
  };

  return (
    <>
      <form onSubmit={selectCapture}>
        {availableCaptures.map(
          (capture: captureID, i: number): React.ReactElement => (
            <div key={i}>
              <input
                type="checkbox"
                id={`${capture.folder}-${capture.name}`}
                name={`${capture.folder}/${capture.name}`}
                onChange={() => handleCaptureCheckboxChange(capture)}
              />
              <label
                htmlFor={`${capture.folder}-${capture.name}`}
              >{`${capture.folder}/${capture.name}`}</label>
            </div>
          ),
        )}
        <button
          type="submit"
          className="bg-gray-400 hover:bg-gray-300 mx-4 px-4 py-1 rounded"
        >
          Load data
        </button>
      </form>
      {/* For debugging, to see whether captures are picked */}
      <div>
        <h2 className="bold text-xl underline">Selected traces: </h2>
        {selectedCaptures.map(
          (capture: captureID, i: number): React.ReactElement => (
            <p key={i}>
              {capture.folder}/{capture.name}
            </p>
          ),
        )}
      </div>
    </>
  );
}
