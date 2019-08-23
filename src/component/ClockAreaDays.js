import React, { Component                                    } from 'react';
import   Icon                                                  from 'react-native-vector-icons/FontAwesome';
import { View, Text, Animated, StyleSheet, Image, ScrollView } from 'react-native';
import { Table, Row, Rows, TableWrapper, Cell                } from 'react-native-table-component';
import { connect                                             } from 'react-redux';
import { Actions                                             } from 'react-native-router-flux';

import { 
    returnIconTemp, animatedDidMount, statusConnect,
    animatedWillReceiveProps, alertPersonalize               } from '../ClimateApi';
import { requestClimate, loadingFalse, loadingTrue           } from '../actions/ClimateAction';


export class ClockAreaDays extends Component {

    constructor(props) {
        super(props);
        this.state = {
            clockAreaBottom : new Animated.Value( -200 ),
            clockAreaHeight : new Animated.Value( 200  ),
            iconBottom      : new Animated.Value( -50  ),
            iconLeft        : new Animated.Value( -50  ),
            iconRight       : new Animated.Value( -50  ),
            typeIcon        : 'chevron-down',
            verify          : true,
            tableHead       : ['Dia', 'Mínima', 'Máxima', 'Clima'],
        }

        this.showFade     = this.showFade.bind(this);
        this.refreshInfo  = this.refreshInfo.bind(this);
    }

    componentDidMount() {
        animatedDidMount(this.state.clockAreaBottom, this.state.iconBottom, this.props.nextPredictions.length);
    }

    componentWillReceiveProps(prevProps){
        animatedWillReceiveProps(prevProps, this.state.clockAreaBottom, this.state.iconBottom);
    }

    /**
     * Show or hide area with last 7 days forecast information.
     */
    showFade() {
        if(this.state.verify) {
            Animated.parallel([ 
                Animated.timing( this.state.clockAreaHeight, {
                    toValue  : 35,
                    duration : 1000,
                }),   
                Animated.timing( this.state.iconBottom, {
                    toValue  : 50,
                    duration : 1000,
                })
            ]).start();
    
            this.setState({verify: false, typeIcon: 'chevron-up'});
        } else {
            Animated.parallel([ 
                Animated.timing( this.state.clockAreaHeight, {
                    toValue  : 200,
                    duration : 1000,
                }),   
                Animated.timing( this.state.iconBottom, {
                    toValue  : 220,
                    duration : 1000,
                })
            ]).start();
            this.setState({verify: true, typeIcon: 'chevron-down'});
        }
    }

    /**
     * Updates screen information according to city already selected.
     */
    async refreshInfo() {
        this.props.loadingTrue();
        if(await statusConnect()) {
            this.props.requestClimate(this.props.idCity);
            if(!this.state.verify) {
                Animated.parallel([ 
                    Animated.timing( this.state.clockAreaHeight, {
                        toValue  : 200,
                        duration : 1000,
                    }),
                    Animated.timing( this.state.iconBottom, {
                        toValue  : 220,
                        duration : 1000,
                    })   
                ]).start();
                this.setState({verify: true, typeIcon: 'chevron-down'});
            }
        } else {
            this.props.loadingFalse();
            alertPersonalize('Atenção!', 'Sem conexão ou internet lenta. \nPor favor, verifique sua conexão :(');
        }
    }

    render() {
        const element = (data, index) => (
            <Image style={styles.iconTemp} source={returnIconTemp(data)}/>
        );
        return (
            <>
            <Animated.View style={[ styles.containerOption,{ bottom: this.state.iconBottom} ]}>
                <View style={{flexDirection : 'row', justifyContent:'space-around', width: '100%'}}>
                    {
                        this.props.nextPredictions.length != 0 &&
                        <View  style={{width: '50%', alignItems: 'flex-start', paddingLeft: 20}}>
                            <Icon name={'refresh'} size={30} style={styles.iconMinimize}  onPress={this.refreshInfo} />
                        </View>
                    }
                    <View  style={{width: this.props.nextPredictions.length != 0 ? '50%' : '100%', alignItems: 'flex-end', paddingRight: 20}}>
                        <Icon name={'search'} size={30}  style={styles.iconMinimize}  onPress={() => Actions.AddCity()} />
                    </View>
                </View>
            </Animated.View>
            {
                this.props.nextPredictions.length != 0 &&
                <Animated.View style={[ styles.container,{ bottom: this.state.clockAreaBottom, height: this.state.clockAreaHeight } ]}>
                    <View style={styles.navBarArea}>
                        <Icon name={this.state.typeIcon} size={30} style={styles.iconMinimize} onPress={this.showFade} />
                    </View>
                    <View style={{marginTop:35, width: '100%'}}>
                        <Table borderStyle={{borderColor: 'transparent'}}>
                            <Row  data={this.state.tableHead} textStyle={styles.tableHead} />
                        </Table>
                        <ScrollView style={{height: '80%'}}>
                            {
                                this.props.nextPredictions.map((rowData, index) => (
                                    <TableWrapper key={index} borderStyle={{borderColor: 'transparent'}} style={styles.rowTable}>
                                        {
                                            rowData.map((cellData, cellIndex) => (
                                                <Cell key={cellIndex} data={cellIndex === 3 ? element(cellData, index) : cellData} textStyle={styles.tableDataText} />
                                            ))
                                        }
                                    </TableWrapper>
                                ))
                            }
                        </ScrollView>
                    </View>
                </Animated.View>
            }
            </>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor     : 'rgba( 8, 18, 26, 1 )',
        height              : 200,
        position            : 'absolute',
        left                : 1,
        right               : 1,
        bottom              : 0,
        justifyContent      : 'center',
        alignItems          : 'center',
        borderTopLeftRadius : 25, 
        borderTopRightRadius: 25,  
        flex                : 1,       
    },
    containerOption: {
        backgroundColor     : 'transparent',
        position            : 'absolute',
        left                : 1,
        right               : 1,
        bottom              : 0,      
    },
    iconMinimize : {
        top           : 1,
        color         : '#FFF',
    },
    navBarArea : {
        justifyContent      : 'center',
        alignItems          : 'center',
        position            : 'absolute', 
        top                 : 0,
        backgroundColor     : 'transparent', 
        width               : '100%',
    },
    tableHead : {
        textAlign           : 'center', 
        color               : '#FFF', 
        fontSize            : 16,  
        marginBottom        : 10,
    },
    tableDataText : {
        textAlign           : 'center', 
        color               : '#FFF', 
        fontSize            : 15,
        marginBottom        : 10,  
    },
    rowTable  : { 
        flexDirection       : 'row', 
    },
    iconTemp : {
        width               : 24, 
        height              : 24, 
        alignSelf           : 'center',
        marginTop           : -10,    
    }
});

const mapStateToProps = (state) => {
    return{
      nextPredictions : state.climate.nextPredictions,
      idCity          : state.climate.idCity
    };
};

const mapDispatchToProps = dispatch => ({
    requestClimate: (idCity) => dispatch(requestClimate(idCity)),
    loadingTrue   : ()       => dispatch(loadingTrue()),
    loadingFalse  : ()       => dispatch(loadingFalse()),
});

const ClockAreaDaysConnect = connect(mapStateToProps, mapDispatchToProps)(ClockAreaDays);
export default ClockAreaDaysConnect;