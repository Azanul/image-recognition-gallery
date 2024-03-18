import { NativeModules } from "react-native";

const Bindings = NativeModules.Bindings;

export const openFolder: any = (folderPath: string) => {
    let jsonString: string = Bindings.list(folderPath);
    return JSON.parse(jsonString);
}