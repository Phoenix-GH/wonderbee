import { AppRegistry } from 'react-native';
import { App } from './src/app';
import TestFairy from 'react-native-testfairy';

TestFairy.begin('5efee55e41b8c70d692234f2592fc53bbc22e085');

AppRegistry.registerComponent('JustHive', () => App);
