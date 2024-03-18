import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  StatusBar,
  useColorScheme,
  PermissionsAndroid,
  Text,
  View,
  Image,
  FlatList,
  ListRenderItem,
  Button,
  Pressable,
} from 'react-native';
import { NativeModules } from 'react-native';

import { Colors } from 'react-native/Libraries/NewAppScreen';

interface entry {
  id: number,
  type: string;
  data: string;
}

const Bindings = NativeModules.Bindings;

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

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

  const [data, setData] = useState<entry[]>([]);

  useEffect(() => {
    requestPermissions();
    openFolder('/storage/emulated/0')
  }, []);

  const openFolder = (folderPath: string) => {
    let jsonString: string = Bindings.list(folderPath);
    setData(JSON.parse(jsonString));
  }

  const renderItem: ListRenderItem<entry> = ({ item }: { item: entry }) => (
    <>
      {
        item.type != "folder" &&
        <Pressable
          // onPressOut={() => openFile}
          accessibilityLabel="Learn more about this purple button"
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
          onPressOut={() => openFolder(item.data)}
          accessibilityLabel="Learn more about this purple button"
        >
          <Text>Data: {item.data}</Text>
        </Pressable>
      }

    </>
  );

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <FlatList
        data={data}
        renderItem={renderItem}
      />
    </SafeAreaView>
  );
}

export default App;
