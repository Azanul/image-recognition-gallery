import { Image, Pressable, Text } from "react-native";
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { openFolder } from "../util/native";

export interface item {
    type: string,
    path: string,
    data?: string;
}

export const ItemComponent = ({ item, setList }: { item: item, setList: React.Dispatch<React.SetStateAction<item[]>> }) => {
    return <>
        {
            item.type != "folder" &&
            // <Pressable
            //   onPressOut={() =>
            //     navigation.navigate('Image', {path: item.path, data: item.data})
            //   }
            //   accessibilityLabel="Open image"
            // >
            <Image
                source={{ uri: `data:image/${item.type};base64,${item.data}` }}
                style={{ width: 100, height: 100 }}
            />
            // </Pressable>
        }
        {
            item.type == "folder" &&
            <Pressable
                onPress={() => setList(openFolder(item.path))}
                accessibilityLabel="Open folder"
            >
                <Text>Data: {item.path}</Text>
            </Pressable>
        }
    </>
}
