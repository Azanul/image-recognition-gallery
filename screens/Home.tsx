import { useEffect, useState } from "react";
import { ItemComponent } from "../components/Item";
import { FlatList, ListRenderItem, PermissionsAndroid } from "react-native";
import { item, openFolder } from "../util/native";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList, numberOfColumns } from "../util/constants";

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

export interface HomeProps {
    dirPath: string 
}

export const HomeScreen = ({ navigation, route }: { navigation: any, route: RouteProp<RootStackParamList, "Home"> }) => {
    const [list, setList] = useState<item[]>([]);

    const renderItem: ListRenderItem<item> = ({ item }: { item: item }) => <ItemComponent crrDirPath={route.params.dirPath} item={item} navigation={navigation} />;

    useEffect(() => {
        requestPermissions();
        setList(openFolder(route.params.dirPath));
    }, []);

    return (
        <>
            <FlatList
                data={list}
                renderItem={renderItem}
                numColumns={numberOfColumns}
                horizontal={false}
            />
        </>
    );
};