import React from 'react';
import {
  SafeAreaView,
  StatusBar,
  useColorScheme,
} from 'react-native';

import { Colors } from 'react-native/Libraries/NewAppScreen';
import { HomeScreen } from './screens/Home';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ImageScreen } from './screens/Image';
import { RootStackParamList, rootDir } from './util/constants';

const Stack = createNativeStackNavigator<RootStackParamList>();

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (

    <NavigationContainer>
      <SafeAreaView style={backgroundStyle}>
        <StatusBar
          barStyle={isDarkMode ? 'light-content' : 'dark-content'}
          backgroundColor={backgroundStyle.backgroundColor} />
      </SafeAreaView>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={({ route }) => ({ title: route.params?.dirPath.slice(rootDir.length) })}
          initialParams={{ dirPath: rootDir }}
        />
        <Stack.Screen name="Image" component={ImageScreen} options={({ route }) => ({ title: route.params?.fileName })} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
