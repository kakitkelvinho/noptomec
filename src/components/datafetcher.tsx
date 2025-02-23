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


function FoldersPicker({ folders, username, repo }: FoldersPickerProps): React.ReactElement {

  const [selectedFolders, setSelectedFolders] = useState<string[]>([]);
  const [captures, setCaptures] = useState<string[]>([]);
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

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    selectedFolders.forEach(folder => {
      fetch(url + folder)
        .then((response: Response): Promise<any> => response.json())
        .then(data => console.log(data));
    });
  }

  return (
    folders.length === 0 ? (
      <p>Please press button to fetch!</p>
    ) : (
      <div className="flex">
        <form onSubmit={handleSubmit} className="flex-1 w-18">
          {folders.map((folder: GitHubItem, i: number): React.ReactElement => (
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
          ))}
          <button
            type="submit"
            className="bg-gray-500 hover:bg-gray-400 mx-4 px-4 py-1 rounded">
            Select Folders
          </button>
        </form>
        <form onSubmit={() => console.log("load captures")} className="flex-2 w-18">
          <p>Something</p>
        </form>
      </div>
    )
  )
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
