import React, { Component, Fragment                } from 'react';
import { View, Text, StyleSheet, 
  ImageBackground, ScrollView, FlatList, 
  TouchableHighlight                               } from 'react-native';
import Icon                                          from 'react-native-vector-icons/FontAwesome';
import { connect                                   } from 'react-redux';
import { Actions                                   } from 'react-native-router-flux';

import Loading                                       from '../../component/Loading';
import SearchBox                                     from '../../component/SearchBox';
import { addCity, removeCity, favoriteCity, 
          favoriteCityNotConnection                } from '../../actions/CitiesActions';
import { requestClimate, loadingTrue, loadingFalse } from '../../actions/ClimateAction';
import { statusConnect, returnImageBk              } from '../../ClimateApi';

export class AddCity extends Component {

  constructor(props) {
    super(props);
    this.state = {}
    this.searchBoxClick = this.searchBoxClick.bind(this);
  }

  searchBoxClick(item) {
    this.props.addCity({
      key       : item.woeid, 
      titleCity : item.title, 
      favorite  : false,
    });
  }

  async removeCitys(idCity) {
    let citys = this.props.cities;
    this.props.removeCity(citys, idCity);
    let arrayTam  = [...this.props.cities];
    arrayTam    = arrayTam.length;
    this.props.loadingTrue();
    if(await statusConnect()) {
      this.props.requestClimate(this.props.cities[arrayTam != 0 ? arrayTam - 1 : 0].key);
    } else {
      this.props.loadingFalse();
    }
  }

  async favoriteCitys(idCity) {
    let citys = this.props.cities;
    this.props.loadingTrue();
    if(await statusConnect()) {
      this.props.favoriteCity(citys, idCity);

      setTimeout(function(){
        Actions.pop();
      }, 1000);

    } else {
      this.props.favoriteCityNotConnection(citys, idCity);
      this.props.loadingFalse();
    }
  }

  async backHome(value = false) {
    this.props.loadingTrue();
    if(await statusConnect()) {
      if(!value) {
        if (!this.props.idCity) {
          this.props.requestClimate(this.props.cities[0].key);
        } else {
          this.props.loadingFalse();
        }
      } else {
        this.props.requestClimate(value);
      }
      Actions.pop();
    } else {
      this.props.loadingFalse();
      Actions.pop();
    }
  }

  render() {
    return (
      <Fragment>
        <ImageBackground style={styles.image} source={returnImageBk(this.props.iconTempToday)}>
          <View style={styles.navBar}>
            {
              this.props.cities.length > 0 &&
              <Icon name='chevron-left' size={30} style={styles.iconReturn} onPress={() => this.backHome()} />
            }
            <Text style={styles.textNavBar}>Procure uma cidade</Text>
          </View>
          <View style={styles.container}>
            <SearchBox dataClick={(item) => this.searchBoxClick(item)} />
            <View style={styles.areaCitys}>
              <ScrollView>
                {
                  this.props.cities.length > 0 &&
                  <FlatList 
                    keyboardShouldPersistTaps = 'handled'
                    data={this.props.cities} 
                    renderItem={({item})=> 
                      <View style={styles.citys}>
                        <Icon name='star' size={24} style={[styles.iconReturn, {marginLeft: 10, marginRight: 10, color: item.favorite ? 'yellow' : 'white' }]} onPress={() => this.favoriteCitys(item.key)} />
                        <TouchableHighlight style={{position: 'absolute', left: 45, alignSelf: 'center'}} onPress={() => this.backHome(item.key)} underlayColor="#000000">
                           <Text style={{ color: '#FFFFFF', fontSize: 18 }}>{item.titleCity}</Text>
                        </TouchableHighlight>
                        {
                          !item.favorite && 
                          <Icon name='trash' size={24} style={[styles.iconReturn, {marginRight: 10}]} onPress={() => this.removeCitys(item.key)} />
                        }
                      </View>
                    } 
                  />
                } 
              </ScrollView>
            </View>
          </View>
          <Loading visible={this.props.load} />
        </ImageBackground>
      </Fragment>
    );
  }
}

const styles = StyleSheet.create({
  container : {
    flex              : 1,
    alignItems        : 'center',
  },
  navBar  : {
    justifyContent    : 'flex-start',
    alignItems        : 'flex-start',
    flexDirection     : 'row',
    backgroundColor   : 'transparent',
    padding           : 25,
    width             : '100%',
    opacity           : 1
  },
  textNavBar  : {
    fontSize          : 20,
    color             : '#FFF',
    fontWeight        : 'bold',
    flexGrow          : 1,
    textAlign         : 'center'
  },
  image : {
    flex              : 1,
    resizeMode        : 'contain',
  },
  iconReturn : {
    color             : '#FFF'
  },
  areaCitys : {
    backgroundColor   : 'rgba(255, 255, 255, 0.7)',
    position          : 'absolute',
    height            : '85%',
    width             : '90%',
    bottom            : 0,
    marginBottom      : '5%',
    borderRadius      : 10,
  },
  citys : {
    marginVertical    : 10,
    paddingVertical   : 10,
    width             : '95%',
    backgroundColor   : '#000000',
    borderRadius      : 6,
    // alignItems        : 'center',
    alignSelf         : 'center',
    flexDirection     : 'row',
    justifyContent    : 'space-between',
  }
});

const mapStateToProps = (state) => {
  return {
    cities         : state.cities.citys,
    load           : state.cities.load,
    favoriteCity   : state.cities.load,
    idCity         : state.climate.idCity,
    iconTempToday  : state.climate.iconTempToday,
  };
};

const mapDispatchToProps = dispatch => ({
  addCity       : (city)           => dispatch(addCity(city)),
  removeCity    : (cities, idCity) => dispatch(removeCity(cities, idCity)),
  favoriteCity  : (cities, idCity) => dispatch(favoriteCity(cities, idCity)),
  favoriteCityNotConnection : (cities, idCity) => dispatch(favoriteCityNotConnection(cities, idCity)),
  requestClimate: (idCity)         => dispatch(requestClimate(idCity)),
  loadingTrue   : ()               => dispatch(loadingTrue()),
  loadingFalse  : ()               => dispatch(loadingFalse()),
});

const AddCityConnect = connect(mapStateToProps, mapDispatchToProps)(AddCity);
export default AddCityConnect;