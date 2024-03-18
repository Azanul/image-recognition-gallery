import { Dimensions, Image } from "react-native";
import { item, openFile } from "../util/native";

const { width, height } = Dimensions.get('window');
const itemDimension = Math.min(width, height);

export const ImageScreen = ({ route }: { route: any }) => {
    const item: item = openFile(route.params.path);
    console.log(item);
    return (
        <>
            <Image
                source={{ uri: `data:image/${item.type};base64,${item.data}` }}
                style={{ width: itemDimension, height: itemDimension }}
            />
        </>
    );
};