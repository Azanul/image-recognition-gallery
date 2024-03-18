import { useEffect, useState } from "react";
import { item, ItemComponent } from "../components/Item";
import { FlatList, ListRenderItem, PermissionsAndroid } from "react-native";
import { openFolder } from "../util/native";

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

export const HomeScreen = () => {
    const [list, setList] = useState<item[]>([]);

    const renderItem: ListRenderItem<item> = ({ item }: { item: item }) => <ItemComponent item={item} setList={setList} />;

    useEffect(() => {
        requestPermissions();
        console.log(openFolder('/storage/emulated/0'));
        setList(openFolder('/storage/emulated/0'));
    }, []);

    return (
        <>
            <FlatList
                data={list}
                renderItem={renderItem}
            />
        </>
    );
};