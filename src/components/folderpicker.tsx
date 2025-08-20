import React, { ReactElement, useState } from 'react';


interface captureID {
  key: string;
  folder: string;
  name: string;
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

interface FolderPickerProps {
  username: string;
  repo: string;
  setAvailableCaptures: React.Dispatch<React.SetStateAction<captureID[]>>;
  folders: Array<GitHubItem>;
}

export default function FolderPicker({ username, repo, setAvailableCaptures, folders }: FolderPickerProps): ReactElement {

  const url: string = `https://api.github.com/repos/${username}/${repo}/contents/`;

  const [selectedFolders, setSelectedFolders] = useState<string[]>([]);


  const handleCheckboxChange = (folderName: string) => {
    setSelectedFolders((prevSelected: string[]): string[] => {
      if (prevSelected.includes(folderName)) {
        return prevSelected.filter((name: string): boolean => name !== folderName);
      } else {
        return [...prevSelected, folderName];
      }
    });
  };


  const handleSubmit = async (event: React.FormEvent): Promise<void> => {
    event.preventDefault();

    try {
      const captures: captureID[] = [];
      const fetches = selectedFolders.map(async (folder: string): Promise<void> => {
        const response = await fetch(url + folder);
        const data: GitHubItem[] = await response.json();

        data.forEach((item: GitHubItem) => captures.push({
          key: `${folder}${item.name}`,
          folder: folder,
          name: item.name,
        }));
      });
      await Promise.all(fetches);
      setAvailableCaptures(captures);
    } catch (error) {
      console.log("Error in fetching data: ", error);
    }
  };


  return (
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
  )
}
