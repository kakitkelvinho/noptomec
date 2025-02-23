import React, { ReactElement } from "react";
import { useState } from "react";

interface DataFetcherProp {
  repo: string,
  username: string,
}

interface GitHubItem {
  _links: { git: string; html: string; self: string };
  git: string;
  html: string;
  self: string;
  download_url: string | null;
  git_url: string;
  html_url: string;
  name: string;
  path: string;
  sha: string;
  size: number;
  type: "file" | "dir"; // "file" or "dir"
  url: string;
}


interface FoldersPickerProps {
  folders: Array<GitHubItem>;
  username: string;
  repo: string;
}

interface captureID {
  key: string;
  folder: string;
  name: string;
  traces?: string[];
}



function FoldersPicker({ folders, username, repo }: FoldersPickerProps): React.ReactElement {

  const [selectedFolders, setSelectedFolders] = useState<string[]>([]);
  const [availableCaptures, setAvailableCaptures] = useState<captureID[]>([]);
  const [selectedCaptures, setSelectedCaptures] = useState<captureID[]>([]);
  const [availableTraces, setAvailableTraces] = useState<captureID[]>([]);
  const url = `https://api.github.com/repos/${username}/${repo}/contents`;

  const handleCheckboxChange = (folderName: string) => {
    setSelectedFolders((prevSelected: string[]): string[] => {
      if (prevSelected.includes(folderName)) {
        return prevSelected.filter((name: string): boolean => name !== folderName);
      } else {
        return [...prevSelected, folderName];
      }
    });
  };

  const handleCaptureCheckboxChange = (capture: captureID) => {
    setSelectedCaptures((prev: captureID[]): captureID[] =>
      prev.some((item: captureID) => item.key === capture.key)
        ? prev.filter((item: captureID) => item.key !== capture.key)
        : [...prev, capture]
    );
  }

  const handleSubmit = async (event: React.FormEvent): Promise<void> => {
    event.preventDefault();

    try {
      const captures: captureID[] = [];
      const fetches = selectedFolders.map(async (folder: string): Promise<void> => {
        const response = await fetch(url + folder);
        const data: GitHubItem[] = await response.json();

        data.forEach((item: GitHubItem) => captures.push({ key: `${folder}${item.name}`, folder: folder, name: item.name }));
      });
      await Promise.all(fetches);
      setAvailableCaptures(captures);
    } catch (error) {
      console.log("Error in fetching data: ", error);
    }
  };

  const selectCapture = async (event: React.FormEvent): Promise<void> => {
    event.preventDefault()
    try {
      const fetchPromises = selectedCaptures.map(async (capture: captureID) => {
        const response = await fetch(`https://cdn.jsdelivr.net/gh/${username}/${repo}@main/${capture.folder}/${capture.name}`);
        const data = await response.json();
        const keys = Object.keys(data);

        setAvailableTraces((prev: captureID[]): captureID[] => [...prev, { ...capture, traces: keys }]);
      });
    } catch (error) {
      console.log('Error', error);
    }

  }

  return (
    <>
      <div className="flex mx-2 space-x-4">
        <div className="flex-1 justify-center">
          <form onSubmit={handleSubmit} className="flex-1">
            {folders.length === 0 ? (<p>Please fetch folders!</p>) : (
              folders.map((folder: GitHubItem, i: number): React.ReactElement => (
                <div key={i}>
                  <input
                    type="checkbox"
                    id={i.toString()}
                    name={folder.name}
                    checked={selectedFolders.includes(folder.name)}
                    onChange={() => handleCheckboxChange(folder.name)}
                  />
                  <label htmlFor={folder.name}>{folder.name}</label>
                </div>
              )))}
            <button
              type="submit"
              className="bg-gray-500 hover:bg-gray-400 mx-4 px-4 py-1 rounded">
              Select Folders
            </button>
          </form>
        </div>
        <div className="flex-1 mx-2 justify-center">
          <form onSubmit={selectCapture}>
            {availableCaptures.map((capture: captureID, i: number): React.ReactElement => (
              <div key={i}>
                <input
                  type="checkbox"
                  id={`${capture.folder}-${capture.name}`}
                  name={`${capture.folder}/${capture.name}`}
                  onChange={() => handleCaptureCheckboxChange(capture)}
                />
                <label htmlFor={`${capture.folder}-${capture.name}`}>{`${capture.folder}/${capture.name}`}</label>
              </div>
            ))}
            <button
              type="submit"
              className="bg-gray-400 hover:bg-gray-300 mx-4 px-4 py-1 rounded">
              Load data
            </button>
          </form>
        </div>
        <div className="flex-1 mx-2 justify-center">
          {availableTraces.length === 0 ? (<p>Select a capture!</p>) : (
            availableTraces.map((capture: captureID, i: number): React.ReactElement => (
              <div key={i}>
                <p>{capture.folder} {capture.name}</p>
                {capture.traces.map((tracename: string): React.ReactElement => <li>{tracename}</li>)}
              </div>
            ))
          )}
        </div>
      </div >
    </>
  );
}

export default function DataFetcher({ username, repo }: DataFetcherProp): React.ReactElement {

  const url = `https://api.github.com/repos/${username}/${repo}/contents`;
  const [folders, setFolders] = useState([]);

  const handleFetch = (url: string) => {
    fetch(url)
      .then((response: Response) => response.json())
      .then(data => setFolders(data.filter((item: GitHubItem): boolean => item.type === "dir")))
      .catch(error => console.error('Error: ', error));
  }

  return (
    <>
      <div className="flex flex-col items-center justify-center">
        <button className="bg-gray-600 hover:bg-gray-400 rounded mx-4 px-4 py-2" onClick={() => handleFetch(url)}>Fetch</button>
        <FoldersPicker folders={folders} username={username} repo={repo} />
      </div>
    </>
  );
}
