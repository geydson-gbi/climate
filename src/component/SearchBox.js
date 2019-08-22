import React, { Component                                    } from 'react';
import { View, TextInput, StyleSheet, ScrollView             } from 'react-native';
import { makeLocationSearch                                  } from '../ClimateApi';
import SearchBoxItem                                           from './SearchBoxItem';

export default class SearchBox extends Component {
    timer = null;

    constructor(props) {
        super(props);
        this.state = {
            txt     : '',
            results : []
        }
        this.txtFill  = this.txtFill.bind(this);
        this.doSearch = this.doSearch.bind(this);
    }

    txtFill(text) {
        this.setState({txt:text, results: []});

        if(typeof this.timer != null) {
            clearTimeout(this.timer);
        }

        this.timer = setTimeout(this.doSearch, 1000);
    }

    doSearch() {
        let txt = this.state.txt.toLowerCase();
        if( txt == 'sao paulo')
            txt = 'são paulo';

        makeLocationSearch(txt)
            .then((results) => {
                this.setState({results});
            })
            .catch((error)  => {
                console.tron.log('Não RECEBEU')
            });
    }

    selectCity = (item) => {
        this.props.dataClick(item);
        this.setState({ results: [], txt: '' })
    }

    render() {
        return(
            <View style={styles.container}>
                <View style={styles.box}>
                    <TextInput style={styles.input} value={this.state.txt} placeholder="Procure aqui..." placeholderTextColor="#FFFFFF" maxLength={30} underlineColorAndroid="transparent" onChangeText={this.txtFill}></TextInput>
                </View>
                {
                    this.state.results.length > 0 &&
                    <ScrollView style={styles.results}>
                        {
                            this.state.results.map((item) => {
                                return (
                                    <View style={styles.searchBox}>
                                        <SearchBoxItem   dataClick={(item) => this.selectCity(item)} key={item.woeid} data={item}/>
                                    </View>
                                );
                            })
                        }
                    </ScrollView>
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container : {
        position          : 'absolute', 
        width             : '100%',
        height            : '100%',
        alignItems        : 'center',
    },
    box : {
        width             : '90%',
        height            : 45,
        backgroundColor   : 'transparent',
        borderColor       : 'transparent',
        borderRadius      : 1,
        borderWidth       : 1
    },
    input : {
        borderRadius      : 5, 
        height            : '100%', 
        width             : '100%',
        backgroundColor   : 'rgba(0, 0, 0, 0.7)',
        color             : '#FFFFFF',
        fontSize          : 19,
        // textAlign         : 'center',
        textAlignVertical : 'center'
    },
    results : {
        width             : '89.6%',
        marginBottom      : 300,
        backgroundColor   : '#FFFFFF',
        zIndex            : 10,
        borderBottomLeftRadius  : 10,
        borderBottomRightRadius : 10
    },
    searchBox : {
        marginVertical    : 3,
        paddingVertical   : 3,
        width             : '95%',
        alignItems        : 'center',
        alignSelf         : 'center',
    }
});