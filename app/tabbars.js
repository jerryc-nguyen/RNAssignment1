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
      onPress={() => navigation.navigate('TopRatedTab')}
      title="Go to settings tab"
    />
    <Button onPress={() => navigation.goBack(null)} title="Go back" />
  </ScrollView>
);

let { height, width } = Dimensions.get('window');
let imageWidth = 100;
let imageHeight = 150;
let colMargin = 5;
let rightColWidth = width - 20 - imageWidth;

const movieStyles = StyleSheet.create({
  container: {
    flex:1,
    flexDirection: 'row',
    padding: 10
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
      movie: props.movie
    };

    this.movie = props.movie
  }

  onClicked() {
    this.props.navigation.navigate('Detail', { movie: this.movie })
  }

  posterPath() {
    return `https://image.tmdb.org/t/p/w342${this.movie.poster_path}`
  }

  render() {
    return (
      <TouchableHighlight underlayColor='transparent' onPress={ this.onClicked.bind(this) }>
        <View style={movieStyles.container}>
          <View style={movieStyles.leftCol}>
            <Image
              style={movieStyles.image}
              source={{uri: this.posterPath()}}>
            </Image>
          </View>

          <View style={movieStyles.rightCol}>
            <Text style={movieStyles.title}>{this.movie.title}</Text>
            <Text style={movieStyles.content}>{this.movie.overview.substring(0, 100)}...</Text>
          </View>

        </View>
      </TouchableHighlight>
    )
  }
}


let api_url = "https://api.themoviedb.org/3/movie/now_playing?api_key=dee541d3e694c0defad6f7ef8115008e"

class MoviesListScreen extends Component {

  constructor(props) {
    super(props)

    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

    this.state = {
      dataSource: ds.cloneWithRows([]),
      refreshing: false
    };

    if(this.props.navigation.state.routeName == "Playing") {
      this.apiUrl = "https://api.themoviedb.org/3/movie/now_playing?api_key=dee541d3e694c0defad6f7ef8115008e"
    } else {
      this.apiUrl = "https://api.themoviedb.org/3/movie/top_rated?api_key=dee541d3e694c0defad6f7ef8115008e"
    }

  }

  componentDidMount() {
    this.getMoviesFromApiAsync()
  }

  getMoviesFromApiAsync() {
    return fetch(this.apiUrl)
      .then((response) => response.json())
      .then((responseJson) => {

        this.setState({refreshing: false})

        this.setState({
          movies: responseJson.results,
          dataSource: this.state.dataSource.cloneWithRows(responseJson.results)
        })
      })
      .catch((error) => { console.error(error); });
  }

  onRefresh() {
    this.setState({refreshing: true})
    this.getMoviesFromApiAsync()
  }

  renderRowData(rowData) {
    return (
      <Movie movie={rowData} navigation={this.props.navigation}/>
    )
  }

  render() {
    return (
      <ListView
        dataSource={this.state.dataSource}
        enableEmptySections={true}
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
    padding: 10
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
    this.params = props.navigation.state.params

    this.state = {
      movie: this.params.movie
    };
  }

  backdropPath() {
    return `https://image.tmdb.org/t/p/original${this.state.movie.backdrop_path}`
  }

  render() {
    return (
      <View style={styles.container}>
        <Image source={{uri: this.backdropPath()}} style={styles.backgroundImage} />

        <View style={styles.fixedBottom}>
          <View style={styles.container}>
            <View style={styles.contentRow}>
              <Text style={styles.detailTitle}>{this.state.movie.title}</Text>
            </View>
            <View style={styles.contentRow}>
              <Text>{this.state.movie.release_date}</Text>
            </View>
            <View style={styles.contentRow}>
              <View style={styles.rowText}>
                <View style={styles.rowTextLeft}>
                  <Ionicons style={styles.icon} name="ios-star" />
                  <Text>{this.state.movie.vote_average}</Text>
                </View>
                <View style={styles.rowTextRight}>
                  <Ionicons style={styles.icon} name="ios-clock" />
                  <Text>2 hour 21 minutes</Text>
                </View>
              </View>
            </View>
            <View style={styles.contentRow}>
              <Text>{this.state.movie.overview}</Text>
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
    screen: MoviesListScreen,
    path: '/playing',
    navigationOptions: ({navigation}) => {
      return {
        header: (props) => { return (
            <View style={{marginTop: 25}}>
              <Search ref="search_box" />
            </View>
          )
        }
      }
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

const TopRatedTab = StackNavigator({
  TopRated: {
    screen: MoviesListScreen,
    path: '/top-rated',
    navigationOptions: ({navigation}) => {
      return {
        header: (props) => { return (
            <View style={{marginTop: 25}}>
              <Search ref="search_box" />
            </View>
          )
        }
      }
    }
  },
  Detail: {
    screen: MovieDetailScreen,
    path: '/movie-detail',
    navigationOptions: ({ navigation }) => ({
      title: "Detail screen",
    }),
  }
});

const StacksInTabs = TabNavigator(
  {
    PlayingTab: {
      screen: PlayingTab,
      path: '/movie-detail',
      navigationOptions: {
        tabBarLabel: 'Now Playing',
        tabBarIcon: ({ tintColor, focused }) => {
          return ( <Ionicons style={{color: tintColor, fontSize: 30}} name="ios-play" /> )
        }
      }
    },
    TopRatedTab: {
      screen: TopRatedTab,
      path: '/top_rated',
      navigationOptions: {
        tabBarLabel: 'Top Rated',
        tabBarIcon: ({ tintColor, focused }) => (
          <Ionicons style={{color: tintColor, fontSize: 30}} name="ios-star" />
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
