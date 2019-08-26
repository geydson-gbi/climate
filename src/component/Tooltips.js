import React, { Component                                    } from 'react';
import { View, Text, Animated, StyleSheet, Image, ScrollView } from 'react-native';

export default class Tooltips extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    render() {
        return (
            
                <View style={styles.talkBubble}>
                    <View style={styles.talkBubbleSquare} />
                    <View style={styles.talkBubbleTriangle} />
                </View>  
        
        );
    }
}

const styles = StyleSheet.create({
    talkBubble: {
        backgroundColor: 'transparent',
        left: 100,
        zIndex : 100,
      },
      talkBubbleSquare: {
        width: 120,
        height: 80,
        backgroundColor: 'red',
        borderRadius: 10
      },
      talkBubbleTriangle: {
        position: 'absolute',
        left: 45,
        top: -26,
        width: 0,
        height: 0,
        borderTopColor: 'transparent',
        borderTopWidth: 13,
        borderRightWidth: 26,
        borderRightColor: 'red',
        borderBottomWidth: 13,
        borderBottomColor: 'transparent',
        transform: [
          {
            rotate: '90deg'
          }
        ]
      }
});