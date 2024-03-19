import 'react-native-gesture-handler';

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
import { createDrawerNavigator } from '@react-navigation/drawer';
import { ImageScreen } from './screens/Image';
import { GeneralStackParamList, rootDir } from './util/constants';

const Drawer = createDrawerNavigator();
const GeneralStack = createNativeStackNavigator<GeneralStackParamList>();
// const TaggedStack = createNativeStackNavigator<GeneralStackParamList>();

function GeneralView() {
  return (
    <GeneralStack.Navigator>
      <GeneralStack.Screen
        name="Home"
        component={HomeScreen}
        options={({ route }) => ({ title: route.params?.dirPath.slice(rootDir.length) })}
        initialParams={{ dirPath: rootDir }}
      />
      <GeneralStack.Screen name="Image" component={ImageScreen} options={({ route }) => ({ title: route.params?.fileName })} />
    </GeneralStack.Navigator>
  );
}

// function TaggedView() {
//   return (
//     <TaggedStack.Navigator>
//       <TaggedStack.Screen
//         name="B"
//         component={B}
//         options={{ tabBarLabel: 'Settings!' }}
//       />
//       <TaggedStack.Screen name="Image" component={ImageScreen} options={({ route }) => ({ title: route.params?.fileName })} />
//     </TaggedStack.Navigator>
//   );
// }

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
      <Drawer.Navigator initialRouteName="Home">
        <Drawer.Screen name="Home" component={GeneralView} />
        {/* <Drawer.Screen name="Notifications" component={TaggedView} /> */}
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

export default App;
