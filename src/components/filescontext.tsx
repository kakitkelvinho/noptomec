import { createContext, useState, ReactNode } from "react";

export interface CaptureData {
  time: number[];
  [key: string]: Array<number>;
}

interface FilesContextType {
  files: CaptureData[];
  setFiles: React.Dispatch<React.SetStateAction<CaptureData[]>>;
}

export const FilesContext = createContext<FilesContextType | undefined>(undefined);

export const FilesProvider = ({ children }: { children: ReactNode }) => {
  const x = Array.from({ length: 1000 }, (_: unknown, i: number): number => i / 999);
  const jsonData = {
    time: x,
    channel1: x.map(value => Math.sin(2 * Math.PI * 30 * value))
  };

  const [files, setFiles] = useState<CaptureData[]>([jsonData,]);

  return (
    <FilesContext.Provider value={{ files, setFiles }}>
      {children}
    </FilesContext.Provider>
  );
};
