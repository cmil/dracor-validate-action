export interface Params {
    schema: string;
    version: string;
    files: string;
    warnOnly: boolean;
}
export declare function trimFilePath(path: string): string;
export declare function defaultVersion(schema: string): string;
export declare function getParams(): Params;
