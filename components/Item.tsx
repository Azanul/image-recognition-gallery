import { Image, Pressable, Text, View } from "react-native";
import Icon from 'react-native-vector-icons/MaterialIcons';
import { item } from "../util/native";
import React from "react";

export const ItemComponent = ({ item, navigation, crrDirPath }: { item: item, navigation: any, crrDirPath: string }) => {
    return <>
        {
            item.type != "folder" &&
            <ImageComponent item={item} navigation={navigation} />
        }
        {
            item.type == "folder" &&
            <FolderComponent folderPath={item.path} folderName={item.path.slice(crrDirPath.length+1)} navigation={navigation} />
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

const FolderComponent = ({ folderPath, navigation, folderName }: { folderPath: string, navigation: any, folderName: string }) => {
    return (
        <Pressable
            onPress={() => navigation.push('Home', { dirPath: folderPath })}
            accessibilityLabel="Open folder"
        >
            <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                <Icon name="folder" size={100} />
                <Text style={{ marginLeft: 10 }}>{folderName}</Text>
            </View>
        </Pressable>
    );
};
