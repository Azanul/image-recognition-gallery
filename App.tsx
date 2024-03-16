import React, { useEffect } from 'react';
import {
  SafeAreaView,
  StatusBar,
  useColorScheme,
  PermissionsAndroid,
} from 'react-native';
import { NativeModules } from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';

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
  
  useEffect(() => {
    requestPermissions();
    Bindings.list('/storage/emulated/0');
    // Bindings.list('/storage/emulated/0/DCIM');
  }, []);

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />

    </SafeAreaView>
  );
}

export default App;
