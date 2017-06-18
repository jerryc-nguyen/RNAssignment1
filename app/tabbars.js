import React, { Component } from 'react';

import {
  Button,
  ScrollView,
  Text,
  View,
  TextInput,
  ListView,
  Image,
  StyleSheet,
  Dimensions,
  RefreshControl,
  TouchableHighlight
} from 'react-native';

import { StackNavigator, TabNavigator } from 'react-navigation';

import Ionicons from 'react-native-vector-icons/Ionicons';
import SampleText from './SampleText';
import Search from 'react-native-search-box';

const MyNavScreen = ({ navigation, banner }) => (
  <ScrollView>
    <SampleText>{banner}</SampleText>
    <Button
      onPress={() => navigation.navigate('Detail', { name: 'Jordan' })}
      title="Open profile screen"
    />
    <Button
      onPress={() => navigation.navigate('NotifSettings')}
      title="Open notifications screen"
    />
    <Button
      onPress={() => navigation.navigate('SettingsTab')}
      title="Go to settings tab"
    />
    <Button onPress={() => navigation.goBack(null)} title="Go back" />
  </ScrollView>
);

let { height, width } = Dimensions.get('window');
let imageWidth = 100;
let imageHeight = 150;
let colMargin = 5;
let rightColWidth = width - 5 - imageWidth;

const movieStyles = StyleSheet.create({
  container: {
    flex:1,
    flexDirection: 'row',
    marginTop: colMargin,
    marginBottom: colMargin
  },
  image: {
    width: imageWidth,
    height: imageHeight
  },
  leftCol: {
    flexDirection:'column',
    marginRight: colMargin
  },
  rightCol: {
    flexDirection:'column',
    width: rightColWidth,
    width: rightColWidth
  },
  title: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 10
  },
  content: {

  }
})


class Movie extends Component {

  constructor(props) {
    super(props)

    this.state = {
      data: props.data
    };
  }

  onClicked() {
    this.props.navigation.navigate('Detail', { id: 'Jordan' })
  }

  render() {
    return (
      <TouchableHighlight underlayColor='transparent' onPress={ this.onClicked.bind(this) }>
        <View style={movieStyles.container}>
          <View style={movieStyles.leftCol}>
            <Image
              style={movieStyles.image}
              source={{uri: 'https://facebook.github.io/react/img/logo_og.png'}}>
            </Image>
          </View>

          <View style={movieStyles.rightCol}>
            <Text style={movieStyles.title}>Lorem Ipsum is simply dummy</Text>

            <Text style={movieStyles.content}>Lorem Ipsum is simply dummy text of the printing
              and typesetting industry.
              Lorem Ipsum has been the industry's standard dummy text ever since the
            </Text>

          </View>
        </View>
      </TouchableHighlight>
    )
  }
}

class PlayingScreen extends Component {
  constructor(props) {
    super(props)

    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

    this.state = {
      dataSource: ds.cloneWithRows(['row 1', 'row 2']),
      refreshing: false
    };
  }

  onRefresh() {
    this.setState({refreshing: true})

    setTimeout( () => {
      this.setState({refreshing: false})
    }, 1000)
  }

  renderRowData(rowData) {
    return (
      <Movie data={rowData} navigation={this.props.navigation}/>
    )
  }

  render() {
    return (
      <ListView
        dataSource={this.state.dataSource}
        refreshControl={ <RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh.bind(this)} /> }
        renderRow={(rowData) => this.renderRowData(rowData)}
      />
    )
  }
}

let styles = StyleSheet.create({
  container: {
    flex: 1
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover', // or 'stretch'
  },
  fixedBottom: {
    width:320,
    position: 'absolute',
    bottom: 20,
    left: (width - 320)/2,
    right: 0,
    backgroundColor: "#fff"
  },
  rowText: {
    flex: 1,
    flexDirection: 'row'
  },
  rowTextLeft: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: "flex-start"
  },
  rowTextRight: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: "flex-end"
  },
  icon: {
    marginRight: 5,
    fontSize: 17
  },
  contentRow: {
    marginTop: 5,
    marginBottom: 5,
    padding: 5
  },
  detailTitle: {
    fontSize: 17,
    fontWeight: 'bold'
  },
  tabbarIcon: {
    fontSize: 30
  }
});


class MovieDetailScreen extends Component {

  constructor(props) {
    super(props)

    this.state = {
      data: props.data
    };
  }

  onClicked() {
    this.props.navigation.navigate('Detail', { id: 'Jordan' })
  }

  render() {
    return (
      <View style={styles.container}>
        <Image source={{uri: 'https://facebook.github.io/react/img/logo_og.png'}} style={styles.backgroundImage} />

        <View style={styles.fixedBottom}>
          <View style={styles.container}>
            <View style={styles.contentRow}>
              <Text style={styles.detailTitle}>Lorem Ipsum is simply dummy text of the printing</Text>
            </View>
            <View style={styles.contentRow}>
              <Text>2017-02-28</Text>
            </View>
            <View style={styles.contentRow}>
              <View style={styles.rowText}>
                <View style={styles.rowTextLeft}>
                  <Ionicons style={styles.icon} name="ios-book" />
                  <Text>69%</Text>
                </View>
                <View style={styles.rowTextRight}>
                  <Ionicons style={styles.icon} name="ios-book" />
                  <Text>2 hour 21 minutes</Text>
                </View>
              </View>
            </View>
            <View style={styles.contentRow}>
              <Text>
                Lorem Ipsum is simply dummy text of the printing
                  and typesetting industry.
              </Text>
            </View>
          </View>
        </View>
      </View>
    )
  }
}

const MyNotificationsSettingsScreen = ({ navigation }) => (
  <MyNavScreen banner="Notifications Screen" navigation={navigation} />
);

const MySettingsScreen = ({ navigation }) => (
  <MyNavScreen banner="Settings Screen" navigation={navigation} />
);

const PlayingTab = StackNavigator({
  Playing: {
    screen: PlayingScreen,
    path: '/',
    navigationOptions: {
      header: (props) => { return (
        <View style={{marginTop: 25}}>
          <Search
            ref="search_box"
            /**
            * There many props that can customizable
            * Please scroll down to Props section
            */
          />
        </View>
      ) }
    },
  },
  Detail: {
    screen: MovieDetailScreen,
    path: '/movie-detail',
    navigationOptions: ({ navigation }) => ({
      title: "Detail screen",
    }),
  }
});

const SettingsTab = StackNavigator({
  Settings: {
    screen: MySettingsScreen,
    path: '/',
    navigationOptions: () => ({
      title: 'Settings',
    }),
  },
  NotifSettings: {
    screen: MyNotificationsSettingsScreen,
    navigationOptions: {
      title: 'Notifications',
    },
  },
});

const StacksInTabs = TabNavigator(
  {
    PlayingTab: {
      screen: PlayingTab,
      path: '/movie-detail',
      navigationOptions: {
        tabBarLabel: 'Now Playing',
        tabBarIcon: ({ tintColor, focused }) => (
          <Ionicons style={styles.tabbarIcon} name="ios-book" />
        )
      },
    },
    SettingsTab: {
      screen: SettingsTab,
      path: '/settings',
      navigationOptions: {
        tabBarLabel: 'Top Rated',
        tabBarIcon: ({ tintColor, focused }) => (
          <Ionicons style={styles.tabbarIcon} name="ios-book" />
        )
      },
    },
  },
  {
    tabBarPosition: 'bottom',
    animationEnabled: false,
    swipeEnabled: false,
  }
);

export default StacksInTabs;
