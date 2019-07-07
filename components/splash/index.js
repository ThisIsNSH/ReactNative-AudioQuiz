import React, { Component } from 'react';
import { Platform, StyleSheet, Image, Text, View } from 'react-native';
import { Audio } from 'expo-av';

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
        this.playAudio = this.playAudio.bind(this)
        this.playFromString = this.playFromString.bind(this)
    }

    componentDidMount() {
        this.playAudio('Welcome to Audio Quiz') 
    }

    playAudio(text) {
        console.log(text)
        fetch('https://texttospeech.googleapis.com/v1/text:synthesize?key=', {
            method: 'POST',
            body: JSON.stringify(
                {
                    "input": {
                        "text": text
                    },
                    "voice": {
                        "languageCode": "en-US",
                        "ssmlGender": "FEMALE"
                    },
                    "audioConfig": {
                        "audioEncoding": "MP3",
                        "speakingRate": 1
                    }
                }
            ),
        }).then((response) => response.json())
            .then((responseJson) => {
                this.playFromString(responseJson.audioContent);
            })
            .catch((error) => {
                console.error(error);
            });


    }

    playFromString = async (base64) => {
        // console.log(base64)
        const sound = new Audio.Sound();
        try {
            await sound.unloadAsync()
            await sound.loadAsync({
                uri: "data:audio/mp3;base64," + base64
            })
            await sound.playAsync();
            this.timeoutHandle = setTimeout(() => {
                this.props.navigation.navigate("Main")
            }, 1000);

        } catch (error) {
            console.log(error)
        }
    }

    render() {

        return (
            <View style={styles.container}>
                <Image style={{ width: 100, height: 100 }} source={require('../../assets/bulb.png')}></Image>
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
