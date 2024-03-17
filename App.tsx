import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  StatusBar,
  useColorScheme,
  PermissionsAndroid,
  Text,
  View,
  Image,
} from 'react-native';
import { NativeModules } from 'react-native';

import { Colors } from 'react-native/Libraries/NewAppScreen';

interface icon {
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

  const [data, setData] = useState<icon[]>([]);

  useEffect(() => {
    requestPermissions();
    let jsonString: string = Bindings.list('/storage/emulated/0');
    setData(JSON.parse(jsonString));
    // Bindings.list('/storage/emulated/0/DCIM');
  }, []);

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      {data.map((object, index) => (
        <View key={index}>
          <Text>Type: {object.type}</Text>
          {object.type == "image" &&
            <Image
            source={{ uri: `data:image/png;base64,${object.data}` }}
            style={{ width: 100, height: 100 }}
          />}
          {object.type == "folder" &&
            <Text>Data: {object.data}</Text>}
        </View>
      ))}

    </SafeAreaView>
  );
}

export default App;
