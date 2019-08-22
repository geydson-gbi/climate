import React, { Component } from 'react';
import { Text, View       } from 'react-native';
import Moment               from 'moment';
import { Table, Row, Rows } from 'react-native-table-component';

class AllDays extends Component {

    render() {
        return (
            <View style= {{ flexDirection   : 'row', marginBottom: 10 }}>
                <Table borderStyle={{borderWidth: 2, borderColor: '#c8e1ff'}}>
                {/* <Text style={{color: '#FFF', fontSize: 20}}>{this.props.data.name} - </Text>
                <Text style={{color: '#FFF', fontSize: 20}}>{Moment(this.props.data.day).format('DD/MM/YYYY HH:mm:ss')}</Text> */}
                </Table>
            </View>
        );
    }
}

export default AllDays;