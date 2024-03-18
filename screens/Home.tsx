import { useEffect, useState } from "react";
import { ItemComponent } from "../components/Item";
import { FlatList, ListRenderItem, PermissionsAndroid } from "react-native";
import { item, openFolder } from "../util/native";
import { rootDir } from "../util/constants";

async function requestPermissions() {
    try {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
            {
                title: 'Read Images Permission',
                message:
                    'Image Recognition Gallery needs permission to read images',
                buttonNeutral: 'Ask Me Later',
                buttonNegative: 'Cancel',
                buttonPositive: 'OK',
            },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log('Permission granted');
        } else {
            console.log('Image permission denied: ' + granted);
        }
    } catch (err) {
        console.warn(err);
    }
}

export const HomeScreen = ({ navigation }: { navigation: any }) => {
    const [list, setList] = useState<item[]>([]);

    const renderItem: ListRenderItem<item> = ({ item }: { item: item }) => <ItemComponent item={item} setList={setList} navigation={navigation} />;

    useEffect(() => {
        requestPermissions();
        setList(openFolder(rootDir));
    }, []);

    return (
        <>
            <FlatList
                data={list}
                renderItem={renderItem}
                numColumns={2}
                horizontal={false}
            />
        </>
    );
};