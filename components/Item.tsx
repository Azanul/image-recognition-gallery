import { Image, Pressable, Text } from "react-native";
import { item } from "../util/native";
import { rootDir } from "../util/constants";

export const ItemComponent = ({ item, navigation }: { item: item, navigation: any }) => {
    return <>
        {
            item.type != "folder" &&
            <Pressable
                onPress={() =>
                    navigation.navigate('Image', { path: item.path })
                }
                accessibilityLabel="Open image"
            >
                <Image
                    source={{ uri: `data:image/${item.type};base64,${item.data}` }}
                    style={{ width: 100, height: 100 }}
                />
            </Pressable>
        }
        {
            item.type == "folder" &&
            <Pressable
                onPress={() => {
                    navigation.push('Home', { dirPath: item.path });
                }
                }
                accessibilityLabel="Open folder"
            >
                <Text>Data: {item.path}</Text>
            </Pressable>
        }
    </>
}
