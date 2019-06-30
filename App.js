import { createStackNavigator, createAppContainer } from 'react-navigation';
import Main from './components/main/index';
import Splash from './components/splash/index';
import Quiz from './components/quiz/index';

const RootStack = createStackNavigator(
  {
    Main: { screen: Main },
    Splash: {
      screen: Splash,
      navigationOptions: {
        header: null,
      },
    },
    Quiz: {
      screen: Quiz
    },
  },
  {
    initialRouteName: 'Splash',
  }
);

const App = createAppContainer(RootStack);

export default App; 