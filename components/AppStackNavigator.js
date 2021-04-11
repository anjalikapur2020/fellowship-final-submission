import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';

import FellowSelectScreen from '../screens/FellowSelectScreen';
import DetailsScreen  from '../screens/DisplayScreen';




export const AppStackNavigator = createStackNavigator({
 FellowSelectedList : {
    screen : FellowSelectScreen,
    navigationOptions:{
      headerShown : false
    }
  },
  RecieverDetails : {
    screen : DetailsScreen,
    navigationOptions:{
      headerShown : false
    }
  }
},
  {
    initialRouteName: 'FellowSelectedList'
  }
);
