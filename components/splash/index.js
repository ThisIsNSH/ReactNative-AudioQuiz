import React, { Component } from 'react';
import { Platform, StyleSheet, Image, Text, View } from 'react-native';

const instructions = Platform.select({
    ios: 'iOS',
    android: 'Android',
    web: 'Web'
});

export default class Splash extends Component {

    static navigationOptions = {
        header: null,
    };

    constructor(props) {
        super(props)
    }

    componentDidMount() {
        this.timeoutHandle = setTimeout(() => {
            this.props.navigation.navigate("Main")
        }, 2000);
    }

    render() {

        return (
            <View style={styles.container}>
                <Image style={{width: 100, height: 100}} source={{uri: '/Users/thisisnsh/Desktop/projects/quiz/assets/bulb.png'}}></Image>
                <Text style={styles.title}>Audio Quiz{"\n"}<Text style={styles.instructions}>{instructions} Version</Text></Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 65,
        textAlign: 'center',
        color: '#AB30E6',
        fontFamily: 'AvenirNext-Bold',
    },
    instructions: {
        textAlign: 'center',
        marginTop: -16,
        fontFamily: 'AvenirNext-Bold',
        color: '#3769DB',
        fontSize: 20,
    },
});
