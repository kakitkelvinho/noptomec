import React, { useEffect } from "react";
import { useState } from "react";
import { CaptureData } from "@/utils/dataconverter";
import FolderPicker from "./folderpicker";
import CapturePicker from "./capturepicker";
import TracePicker from "./tracepicker";

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
}

interface CaptureObject extends captureID {
  data: CaptureData;
}

function DataPicker({ folders, username, repo }: FoldersPickerProps): React.ReactElement {
  const [availableCaptures, setAvailableCaptures] = useState<captureID[]>([]);
  const [availableTraces, setAvailableTraces] = useState<CaptureObject[]>([]);

  return (
    <>
      <div className="flex mx-2 space-x-4">
        <div className="flex-1 justify-center">
          <FolderPicker username={username} repo={repo} setAvailableCaptures={setAvailableCaptures} folders={folders} />
        </div>
        <div className="flex-1 mx-2 justify-center">
          <CapturePicker username={username} repo={repo} setAvailableTraces={setAvailableTraces} availableCaptures={availableCaptures} />
        </div>
        <div className="flex-1 mx-2 justify-center">
          <TracePicker availableTraces={availableTraces} />
        </div>
      </div >
    </>
  );
}



export default function DataFetcher(): React.ReactElement {

  const [username, setUsername] = useState("kakitkelvinho");
  const [repo, setRepo] = useState("cavitylockingdata");

  const [folders, setFolders] = useState([]);

  useEffect(() => {
    fetch(`https://api.github.com/repos/${username}/${repo}/contents`)
      .then(response => {
        console.log("Initial fetch success")
        return response.json();
      })
      .then(data => setFolders(data.filter((item: GitHubItem): boolean => item.type === "dir")))
      .catch(error => console.error("Initial fetch failed because: ", error));
  }, [username, repo]);

  const handleFetch = (username: string, repo: string) => {
    const url = `https://api.github.com/repos/${username}/${repo}/contents`;
    fetch(url)
      .then((response: Response) => {
        console.log("Fetch success!");
        return response.json();
      })
      .then(data => setFolders(data.filter((item: GitHubItem): boolean => item.type === "dir")))
      .catch(error => console.error('Unable to fetch error: ', error));
  }

  const textboxChange = (e: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<string>>): void => {
    setter(e.target.value);
  }

  return (
    <>
      <div className="flex flex-col items-center justify-center">
        <div className="flex h-6 my-2">
          <input className="mx-4 text-black" type="text" id="username" value={username} onChange={e => textboxChange(e, setUsername)} />
          <input className="mx-4 text-black" type="text" id="repo" value={repo} onChange={e => textboxChange(e, setRepo)} />
        </div>
        <button className="bg-gray-600 hover:bg-gray-400 rounded mx-4 my-2 px-4 py-2" onClick={() => handleFetch(username, repo)}>Fetch</button>
        <DataPicker folders={folders} username={username} repo={repo} />
      </div>
    </>
  );
}
