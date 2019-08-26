import React, { Component, Fragment                                } from 'react';
import { View, Text, StyleSheet, ImageBackground, Image, 
         TouchableHighlight,  SafeAreaView                         } from 'react-native';
import   Icon                                                        from 'react-native-vector-icons/FontAwesome';
import { connect                                                   } from 'react-redux';
import Geolocation                                                   from 'react-native-geolocation-service';
import { Actions                                                   } from 'react-native-router-flux';
import Carousel, { Pagination                                      } from 'react-native-snap-carousel';

import   ClockAreaDays                                               from '../../component/ClockAreaDays';
import   Loading                                                     from '../../component/Loading';
import   Tooltips                      from '../../component/Tooltips';
import { requestClimate, requestGPS, loadingTrue, loadingFalse     } from '../../actions/ClimateAction';
import { favoriteCity, favoriteCityNotConnection, 
         removeFavoriteCity                                        } from '../../actions/CitiesActions';
import { returnIconTemp, requestLocPermission, cityIdApi, 
         verifyGpsActive, statusConnect, alertPersonalize, 
         returnImageBk                                             } from '../../ClimateApi';

export class Home extends Component {
  constructor(props) {
      super(props);
      this.state = {
        slider1ActiveSlide : 0,
      }
      this.getCurrentLocation = this.getCurrentLocation.bind(this);
      this.nextCity           = this.nextCity.bind(this);   
  }
  
  async componentWillMount() {
    this.props.loadingTrue();
    if(await statusConnect()) {
        if(this.props.favoriteCity == false) {
            if (!this.props.idCity) {
              this.getCurrentLocation();
            }
            else {
              this.props.requestClimate(this.props.idCity);
            }
        } else {
          this.props.requestClimate(this.props.favoriteCity);
        }
    } else {
      this.props.loadingFalse();
      alertPersonalize('Atenção!', 'Sem conexão ou internet lenta. \nPor favor, verifique sua conexão :(');
    }
  }

  /**
   * Check if you have permission to pick up the location or will ask if you have follow the steps to bring the information and update it.
   */
  getCurrentLocation = async () => {
    if(await requestLocPermission()) {
      this.props.loadingTrue();
      if(await statusConnect()) {
        if(await verifyGpsActive()) {
          this.props.loadingTrue();
          Geolocation.getCurrentPosition(
            (position) => {
                this.locationApi(position.coords.latitude, position.coords.longitude);
            },
            (error) => {
                alertPersonalize('Atenção!','Ocorreu um erro na localização do GPS :(');
            },
            { enableHighAccuracy:true, timeout: 10000, maximumAge: 10000}
          );
        } else {
          if(this.props.favoriteCity == false) {
            if (!this.props.idCity) {
              this.props.loadingFalse();
              Actions.AddCity();
            } else {
              this.props.requestClimate(this.props.idCity);
            }
          } else {
            this.props.requestClimate(this.props.favoriteCity);
          } 
        }
      } else {
        this.props.loadingFalse();
        alertPersonalize('Atenção!', 'Sem conexão ou internet lenta. \nPor favor, verifique sua conexão :(');
      }
    } else {
      this.props.requestGPS(false);
      Actions.AddCity();
    }
  };

  /**
   * Api call and after getting the answer updates the information in the props, if successful.
   */
  async locationApi(lat, long) {
    let idCity = await cityIdApi(lat, long);
    this.props.requestClimate(idCity);
  }

  /**
   * Function sets city as favorite by past id and directs to main screen displaying information of respective city.
   *
   */
  async favoriteCitys() {
    let citys  = this.props.citys;
    let idCity = this.props.idCity;
    this.props.loadingTrue();

    if(this.props.favoriteCity != idCity){
      if(await statusConnect()) {
        this.props.favoriteCitie(citys, idCity);
        this.props.requestClimate(idCity);
      } else {
        this.props.favoriteCityNotConnection(citys, idCity);
        this.props.loadingFalse();
      }
    } else {
      this.props.removeFavoriteCity(citys, idCity);
      this.props.loadingFalse();
    }
  }

  /**
   * Carousel function to set the index and update information conforms to the city of the index.
   */
  nextCity(index) {
    this.setState({ slider1ActiveSlide: index });
    this.props.requestClimate(this.props.citys[index].key);
  }

  render() {
    this.props.citys.forEach((element, index) => {                
      if(element.key == this.props.idCity && this.state.slider1ActiveSlide != index){
         this.setState({slider1ActiveSlide: index});
      }
    });

    const { slider1ActiveSlide } = this.state;
   
    return (
        <Fragment>
            <ImageBackground style={styles.image} source={returnImageBk(this.props.iconTempToday ? this.props.iconTempToday : '' )}>
                <View style={styles.navBar}>
                    <View style={{flex: 1, alignItems: 'flex-end'}}>
                  
                      <Icon name='map-marker' size={30} style={styles.iconMarker} onPress={this.getCurrentLocation} />
                      {/* <Tooltips/> */}
                    </View>
                    <View style={{flex: 2, alignItems: 'center'}}>
                      <Text style={styles.textNavBar}>
                        {this.props.city && this.props.idCity ? this.props.city : this.props.city ? this.props.city : this.props.notConect}
                      </Text>
                    </View>
                    <View style={{flex: 1}}>
                      {
                        this.props.idCity.length > 0 || this.props.idCity != '' &&
                        <Icon name='star' size={22} style={[styles.iconMarker,{ left: 10, color: this.props.favoriteCity && this.props.favoriteCity == this.props.idCity ? 'yellow' : '#FFFFFF' }]} onPress={()=> this.favoriteCitys()} />
                      }
                    </View>
                </View>
              
                <View style={styles.container}>
                  <View style={styles.content}>
                    <SafeAreaView style={styles.safeArea}>
                      
                      <TouchableHighlight
                        underlayColor="transparent"
                        disabled={ this.state.slider1ActiveSlide != 0 ? false : true }
                        onPress={
                          () => this.nextCity(this.state.slider1ActiveSlide - 1)
                        }>
                        <Icon 
                          name='angle-left'   
                          size={40} 
                          style={{
                            color: this.state.slider1ActiveSlide != 0 ? 
                            'rgba(255, 255, 255, 1)' : 'rgba(255, 255, 255, 0)'
                          }} 
                        />
                      </TouchableHighlight>
                
                      <View style={styles.areaCarousel}>
                        <Carousel
                          ref={ref => this.carousel = ref}
                          data={this.props.citys}
                          renderItem={({item }) =>
                            <View style={styles.circuleToDay}>
                                <Text  style={{ fontSize : 60, color : '#FFF'}}>{this.props.today}</Text>
                                <Image style={{ width    : 32, height: 32, marginLeft: 3}} source={returnIconTemp(this.props.iconTempToday)}/>
                                <Text  style={{ fontSize : 15, top   : 10, color :'#FFF'}}>{this.props.currentDate}</Text>
                            </View>
                          }
                          sliderWidth={250}
                          itemWidth={250}
                          onSnapToItem={(index) => this.nextCity(index) }
                          firstItem={slider1ActiveSlide}
                        />

                        <View style={{justifyContent: 'center'}}>
                          <Pagination
                            dotsLength={this.props.citys.length}
                            activeDotIndex={slider1ActiveSlide}
                            containerStyle={styles.paginationContainer}
                            dotColor={'rgba(255, 255, 255, 0.92)'}
                            dotStyle={styles.paginationDot}
                            inactiveDotColor={"#000000"}
                            inactiveDotOpacity={0.5}
                            inactiveDotScale={1.1}
                            carouselRef={this._slider1Ref}
                            tappableDots={!!this._slider1Ref}
                          />
                        </View>
                      </View>
                      
                      <TouchableHighlight
                        underlayColor="transparent"
                        disabled={ 
                          this.props.citys.length-1 > this.state.slider1ActiveSlide ? false : true 
                        }
                        onPress={
                            () => this.nextCity(this.state.slider1ActiveSlide + 1)
                        }>
                        <Icon 
                          name='angle-right' 
                          size={40} 
                          style={{
                            color: this.props.citys.length-1 > this.state.slider1ActiveSlide ? 
                            'rgba(255, 255, 255, 1)' : 'rgba(255, 255, 255, 0)' 
                          }} 
                        />
                      </TouchableHighlight>
              
                    </SafeAreaView>
                  </View>
                  <ClockAreaDays /> 
                </View>
                <Loading visible={this.props.load} />
            </ImageBackground>
        </Fragment>
    );
  }
}

const styles = StyleSheet.create({
  container : {
    flex            : 1,
    justifyContent  : 'center',
    alignItems      : 'center',
  },
  navBar : {
    justifyContent  : 'center',
    alignItems      : 'center',
    flexDirection   : 'row', 
    backgroundColor : 'transparent', 
    padding         : 25,
  },
  textNavBar : {
    fontSize        : 20,
    color           : '#FFF',
    fontWeight      : 'bold',
    width           : '100%',
    textAlign       : 'center'
  },
  image      : {
    flex            : 1,
    backgroundColor : '#333333',
    resizeMode      : 'contain',
    opacity         : 0.85,
  },
  iconMarker : {
    marginRight     : 15, 
    color           :'#FFF'
  },
  content : {
    top             : -100, 
    //width           : 200, 
    width           : '100%',
    height          : 200,  
    justifyContent  : 'center',
    alignItems      : 'center', 
  },
  areaCarousel : {
    width            : 200, 
    height           : 200,  
    marginLeft       : 25,
    marginRight      : 25,
    justifyContent   : 'center',
    alignItems       : 'center', 
    borderRadius     : 100, 
    backgroundColor  : 'rgba( 8, 18, 26, 0.4 )',
  },
  circuleToDay : {
    width           : '100%',
    height          : '100%',
    justifyContent  : 'center',
    alignItems      : 'center', 
  },
  paginationContainer : {
    top             : 40,
    paddingVertical : 8
  },
  paginationDot : {
      width             : 8,
      height            : 8,
      borderRadius      : 4,
      marginHorizontal  : 8
  },
  safeArea  : {
    flex            : 1,
    flexDirection   : 'row',
    alignItems      : 'center',
    justifyContent  : 'center',
    width           : '100%'
  },
});

const mapStateToProps = (state) => {
    return{
      today           : state.climate.today,
      currentTime     : state.climate.currentTime,
      currentDate     : state.climate.currentDate,
      city            : state.climate.city,
      iconTempToday   : state.climate.iconTempToday,
      nextPredictions : state.climate.nextPredictions,
      load            : state.climate.load,
      idCity          : state.climate.idCity,
      notConect       : state.climate.notConect,
      indexCarousel   : state.climate.indexCarousel,
      favoriteCity    : state.cities.favoriteCity,
      citys           : state.cities.citys,
    };
};

const mapDispatchToProps = dispatch => ({
  requestClimate: (idCity)  => dispatch(requestClimate(idCity)),
  requestGPS    : (load)    => dispatch(requestGPS(load)),
  loadingTrue   : ()        => dispatch(loadingTrue()),
  loadingFalse  : ()        => dispatch(loadingFalse()),
  favoriteCitie : (cities, idCity) => dispatch(favoriteCity(cities, idCity)),
  favoriteCityNotConnection : (cities, idCity) => dispatch(favoriteCityNotConnection(cities, idCity)),
  removeFavoriteCity        : (cities, idCity) => dispatch(removeFavoriteCity(cities, idCity)),
});

const HomeConnect = connect(mapStateToProps, mapDispatchToProps)(Home);
export default HomeConnect;