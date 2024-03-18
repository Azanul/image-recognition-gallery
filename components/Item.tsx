import { Image, Pressable, Text } from "react-native";
import { item } from "../util/native";

export const ItemComponent = ({ item, navigation }: { item: item, navigation: any }) => {
    return <>
        {
            item.type != "folder" &&
            <ImageComponent item={item} navigation={navigation} />
        }
        {
            item.type == "folder" &&
            <FolderComponent item={item} navigation={navigation} />
        }
    </>
}

const ImageComponent = ({ item, navigation }: { item: item, navigation: any }) => {
    return <Pressable
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

const FolderComponent = ({ item, navigation }: { item: item, navigation: any }) => {
    return <Pressable
        onPress={() => {
            navigation.push('Home', { dirPath: item.path });
        }
        }
        accessibilityLabel="Open folder"
    >
        <Text>Data: {item.path}</Text>
    </Pressable>
}
