import { Dimensions, Image, Pressable, Text, View } from "react-native";
import Icon from 'react-native-vector-icons/MaterialIcons';
import { item } from "../util/native";
import React from "react";
import { numberOfColumns } from "../util/constants";

const { width, height } = Dimensions.get('window');
const imageDimension = Math.min(width / numberOfColumns, height / numberOfColumns);

export const ItemComponent = ({ item, navigation, crrDirPath }: { item: item, navigation: any, crrDirPath: string }) => {
    return <>
        {
            item.type != "folder" &&
            <ImageComponent item={item} navigation={navigation} />
        }
        {
            item.type == "folder" &&
            <FolderComponent folderPath={item.path} folderName={item.path.slice(crrDirPath.length + 1)} navigation={navigation} />
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
            style={{ width: imageDimension, height: imageDimension }}
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
                <Icon name="folder" size={imageDimension} />
                <Text style={{ marginLeft: 10 }}>{folderName}</Text>
            </View>
        </Pressable>
    );
};
