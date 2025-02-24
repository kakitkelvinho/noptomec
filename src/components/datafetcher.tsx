import React from "react";
import { useState } from "react";
import { CaptureData } from "@/utils/dataconverter";
import FolderPicker from "./folderpicker";
import CapturePicker from "./capturepicker";
import TracePicker from "./tracepicker";

interface DataFetcherProp {
  repo: string;
  username: string;
  setter: Function;
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
  setter: Function;
}

interface captureID {
  key: string;
  folder: string;
  name: string;
}

interface CaptureObject extends captureID {
  data: CaptureData;
}

function DataPicker({ folders, username, repo, setter }: FoldersPickerProps): React.ReactElement {
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
          <TracePicker availableTraces={availableTraces} setter={setter} />
        </div>
      </div >
    </>
  );
}

export default function DataFetcher({ username, repo, setter }: DataFetcherProp): React.ReactElement {

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
        <DataPicker folders={folders} username={username} repo={repo} setter={setFolders} />
      </div>
    </>
  );
}
