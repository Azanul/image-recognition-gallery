import { NativeModules } from "react-native";

export interface item {
    type: string,
    path: string,
    data?: string;
}

const Bindings = NativeModules.Bindings;

export const openFolder: any = (folderPath: string) => {
    let jsonString: string = Bindings.list(folderPath);
    return JSON.parse(jsonString);
}

export const openFile: any = (filePath: string) => {
    let jsonString: string = Bindings.get(filePath);
    return JSON.parse(jsonString);
}

export const openTag: any = (tagName: string) => {
    let jsonString: string = Bindings.list(tagName);
    return JSON.parse(jsonString);
}