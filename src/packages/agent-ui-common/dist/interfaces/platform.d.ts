import { FileMeta } from '../types/FileData';
export interface FrontendContext {
    client: 'vscode' | 'apim' | 'apistudio-desktop' | 'apistudio-embedded';
    version?: string;
    context?: string;
}
export interface AuthContext {
    auth_type?: string;
    auth_values?: string;
}
export interface PlatformAPI {
    logout?: () => Promise<void>;
}
export interface FileProvider {
    getFileList: () => Promise<FileMeta[]>;
    saveSelectedFilePath?: (file: FileMeta) => Promise<void>;
    notifyNoFilesError?: (message: string) => void;
}
//# sourceMappingURL=platform.d.ts.map