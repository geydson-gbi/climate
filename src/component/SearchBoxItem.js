import React, { Component                                    } from 'react';
import { TouchableHighlight, StyleSheet, Text, View          } from 'react-native';
import Icon                                                    from 'react-native-vector-icons/FontAwesome';

export default class SearchBoxItem extends Component {

    constructor(props) {
        super(props);
        this.state = {
        }
        this.itemClick  = this.itemClick.bind(this);
    }

    itemClick() {
        this.props.dataClick(this.props.data);
    }

    render() {
        return(
            <TouchableHighlight style={styles.itemButton} onPress={this.itemClick} underlayColor="#000000">
                <View style={{width: '100%', flexDirection: 'row'}}>
                    <Text style={styles.itemText}>{this.props.data.title}</Text>
                    <Icon name='plus' size={20} style={styles.iconStyle} />
                </View>
            </TouchableHighlight>
        );
    }
};

const styles = StyleSheet.create({
    itemButton : {
        height          : 45,
        justifyContent  : 'center',
        alignSelf       : 'center',
        backgroundColor : 'rgba(0, 0, 0, 0.85)',
        borderRadius    : 6,
    },
    itemText : {
        fontSize       : 18,
        color          : '#FFFFFF', 
        fontWeight     : 'bold',
        flexGrow       : 1,
        left           : 10,
    },
    iconStyle : {
        color          : '#FFFFFF',
        right          : 10
    },
});