/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import codePush from "react-native-code-push";
import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import SplashScreen from 'react-native-splash-screen';
import ViewPager from '@react-native-community/viewpager';

if(__DEV__) {
  import('./ReactotronConfig').then(() => console.log('Reactotron Configured'))
}

import AudioUploadingView from './screens/AudioUploadingView';
import AudioRecordingView from './screens/AudioRecordingView';

const App: () => React$Node = () => {

  const [ selectedTab, setSelectedTab ] = useState(0);

  useEffect(() => {
    SplashScreen.hide();
  }, [])

  return (
    <>
      <StatusBar barStyle="dark-content" />
        <SafeAreaView style={{flex: 1, backgroundColor: Colors.lighter,}}>
          <View
            style={{flexDirection: 'row'}}
          >
            <TouchableOpacity
              style={{padding: 16, paddingBottom: 8, borderBottomWidth: selectedTab===0 ? 2 : 0, borderColor: 'purple'}}
            >
              <Text style={{fontWeight: selectedTab === 0 ? 'bold' : 'normal', color: 'purple', textTransform: 'uppercase'}}>Record</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{padding: 16, paddingBottom: 8, borderBottomWidth: selectedTab===1 ? 2 : 0, borderColor: 'purple'}}            
            >
              <Text style={{fontWeight: selectedTab === 1 ? 'bold' : 'normal', color: 'purple', textTransform: 'uppercase'}}>Upload</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            contentContainerStyle={{ flex: 1 }}
            style={styles.scrollView}
          >
            <ViewPager style={styles.viewPager} initialPage={0} onPageSelected={e => setSelectedTab(e.nativeEvent.position)}>
              <View key="1" style={styles.sectionContainer}>
                <AudioRecordingView />
              </View>
              <View key="2" style={styles.sectionContainer}>
                <AudioUploadingView />
              </View>
            </ViewPager>
          </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  viewPager: {
    flex: 1,
  },
  scrollView: {

  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    flex: 1,
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

export default codePush(App);
