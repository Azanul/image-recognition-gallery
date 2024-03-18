import { Image, Pressable, Text } from "react-native";
import { item, openFolder } from "../util/native";
import { rootDir } from "../util/constants";

export const ItemComponent = ({ item, setList, navigation }: { item: item, setList: React.Dispatch<React.SetStateAction<item[]>>, navigation: any }) => {
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
                    navigation.setOptions({ title: item.path.slice(rootDir.length) });
                    setList(openFolder(item.path))
                }
                }
                accessibilityLabel="Open folder"
            >
                <Text>Data: {item.path}</Text>
            </Pressable>
        }
    </>
}
