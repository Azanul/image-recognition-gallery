import { Image } from "react-native";
import { item, openFile } from "../util/native";

export const ImageScreen = ({ route } : { route: any }) => {
    const item: item = openFile(route.params.path);
    console.log(item);
    return (
        <>
            <Image
                source={{ uri: `data:image/${item.type};base64,${item.data}` }}
                style={{ width: 300, height: 300 }}
            />
        </>
    );
};