import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, AsyncStorage } from 'react-native';
import PropTypes from 'prop-types';
import * as Permissions from 'expo-permissions';
import { Audio } from 'expo-av'
import * as FileSystem from 'expo-file-system';

export default class Quiz extends Component {

    static navigationOptions = {
        title: "",
    };

    constructor(props) {
        super(props)

        this.recording = null;
        this.isSeeking = false;
        this.shouldPlayAtEndOfSeek = false;

        this.recordingSettings = {
            android: {
                extension: '.3gp',
                outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_AMR_WB,
                audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AAC,
                sampleRate: 16000,
                numberOfChannels: 2,
                bitRate: 128000,
            },
            ios: {
                extension: '.wav',
                audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_HIGH,
                sampleRate: 44100,
                numberOfChannels: 1,
                bitRate: 128000,
                linearPCMBitDepth: 16,
                linearPCMIsBigEndian: false,
                linearPCMIsFloat: false,
            },
        };

        const { navigation } = this.props;
        this.nav = navigation.getParam('nav');
        this.category = navigation.getParam('category', '9');

        this.state = {
            no: 1,
            correct: 0,
            haveRecordingPermissions: false,
            category: this.category,
            questions: [{ question: 'Question', correct_answer: 'Option 1' }],
            options: [['Option 1', 'Option 2', 'Option 3', 'Option 4']],
            haveRecordingPermissions: false,
            isLoading: false,
            isPlaybackAllowed: false,
            muted: false,
            soundPosition: null,
            soundDuration: null,
            recordingDuration: null,
            shouldPlay: false,
            isPlaying: false,
            isRecording: false,
            fontLoaded: false,
            shouldCorrectPitch: true,
            volume: 1.0,
            rate: 1.0,
        }

        this.questions = []

        fetch('https://opentdb.com/api.php?amount=10&encode=url3986&type=multiple&category=' + this.state.category, {
            method: 'GET',
        }).then((response) => response.json())
            .then((responseJson) => {
                this.options1 = []
                console.log(responseJson)
                for (var i = 0; i < responseJson.results.length; i++) {
                    this.questions.push({ question: decodeURIComponent(responseJson.results[i].question), correct_answer: decodeURIComponent(responseJson.results[i].correct_answer), incorrect_answers: responseJson.results[i].incorrect_answers.map(x => decodeURIComponent(x)) })
                    this.options1.push(decodeURIComponent(responseJson.results[i].correct_answer))
                    responseJson.results[i].incorrect_answers.map(x => this.options1.push(decodeURIComponent(x)))
                    this.shuffle(this.options1)
                    this.setState({
                        questions: this.questions,
                        options: [...this.state.options, this.options1]
                    }, () => {
                        this.options1 = []
                    });
                }
                // console.log(this.state.questions)
                var f = this.state.options
                f.shift()

                this.setState({
                    questions: this.questions,
                    options: f
                }, () => {
                    this.playAudio(this.state.questions[this.state.no - 1].question + '.     ' + this.state.options[this.state.no - 1][0] + '.     ' + this.state.options[this.state.no - 1][1] + '.     ' + this.state.options[this.state.no - 1][2] + '.or.     ' + this.state.options[this.state.no - 1][3] + '.     ')
                });
            })
            .catch((error) => {
                console.error(error);
            });

        this.optionSelected = this.optionSelected.bind(this)
        this.playAudio = this.playAudio.bind(this)
        this.playFromString = this.playFromString.bind(this)

    }

    componentDidMount() {
        // this._stopPlaybackAndBeginRecording();
    }

    async _stopPlaybackAndBeginRecording() {
        const response = await Permissions.askAsync(Permissions.AUDIO_RECORDING);
        this.setState({
            haveRecordingPermissions: response.status === 'granted',
        });
        if (!response.status === 'granted')
            return;

        this.setState({
            isLoading: true,
        });
        await Audio.setAudioModeAsync({
            allowsRecordingIOS: true,
            staysActiveInBackground: true,
            playThroughEarpieceAndroid: true,
            interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
            playsInSilentModeIOS: true,
            shouldDuckAndroid: true,
            interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
        });
        if (this.recording !== null) {
            this.recording.setOnRecordingStatusUpdate(null);
            this.recording = null;
        }

        const recording = new Audio.Recording();
        await recording.prepareToRecordAsync(this.recordingSettings);

        this.recording = recording;
        await this.recording.startAsync();
        this.setState({
            isLoading: false,
        });
        setTimeout(() => {
            this._stopRecordingAndEnablePlayback()
        }, 3000);
    }

    async _stopRecordingAndEnablePlayback() {
        this.setState({
            isLoading: true,
        });
        try {
            await this.recording.stopAndUnloadAsync();
        } catch (error) {
            // Do nothing -- we are already unloaded.
        }

        const info = await FileSystem.readAsStringAsync(this.recording.getURI(), { encoding: FileSystem.EncodingType.Base64 });
        // console.log(`FILE INFO: ${info}`);

        await fetch('https://speech.googleapis.com/v1/speech:recognize?key=', {
            method: 'POST',
            body: JSON.stringify(
                {
                    "config": {
                        "encoding": 'LINEAR16',
                        "sampleRateHertz": 41000,
                        "languageCode": "en-US"
                    },
                    "audio": {
                        "content": info
                    }
                }
            ),
        }).then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson)
                this.optionSelected(responseJson.results[0].alternatives[0].transcript)
            })
            .catch((error) => {
                console.error(error);
            });

        this.setState({
            isLoading: false,
        });
    }

    shuffle(a) {
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
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
        const sound = new Audio.Sound();
        try {
            await sound.unloadAsync()
            await sound.loadAsync({
                uri: "data:audio/mp3;base64," + base64
            })
            await sound.playAsync();
        } catch (error) {
            console.log(error)
        }
    }

    optionSelected(text) {
        if (text != 'Option 1' && text != 'Option 2' && text != 'Option 3' && text != 'Option 4') {
            console.log(this.state.questions[this.state.no - 1].correct_answer.toLowerCase())
            if (text.toLowerCase() == this.state.questions[this.state.no - 1].correct_answer.toLowerCase()) {
                if (this.state.no < 10) {
                    this.setState({
                        no: this.state.no + 1,
                        correct: this.state.correct + 1
                    }, () => {
                        this.playAudio(this.state.questions[this.state.no - 1].question + '.     ' + this.state.options[this.state.no - 1][0] + '.     ' + this.state.options[this.state.no - 1][1] + '.     ' + this.state.options[this.state.no - 1][2] + '.or.     ' + this.state.options[this.state.no - 1][3] + '.     ')
                    });
                    Alert.alert(
                        this.state.correct+1 +'/10',
                        'Correct Answer',
                        { cancelable: true }
                    );
                } else {
                    AsyncStorage.setItem('@' + this.state.category, JSON.stringify(this.state.correct + 1), () => {
                        Alert.alert(
                            this.state.correct + 1 + '/10',
                            'You have answered all questions in this category. Play other category now!',
                            [
                                { text: 'OK', onPress: () => this.nav.navigate("Main") },
                            ],
                            { cancelable: true },
                        );
                    });

                }
            } else if (text.toLowerCase().replace(/[^\w]/g,'') == this.state.questions[this.state.no - 1].correct_answer.toLowerCase().replace(/[^\w]/g,'')) {
                if (this.state.no < 10) {
                    this.setState({
                        no: this.state.no + 1,
                        correct: this.state.correct + 1
                    }, () => {
                        this.playAudio(this.state.questions[this.state.no - 1].question + '.     ' + this.state.options[this.state.no - 1][0] + '.     ' + this.state.options[this.state.no - 1][1] + '.     ' + this.state.options[this.state.no - 1][2] + '.or.     ' + this.state.options[this.state.no - 1][3] + '.     ')
                    });
                    Alert.alert(
                        this.state.correct +'/10',
                        'Correct Answer',
                        { cancelable: true }
                    );
                } else {
                    AsyncStorage.setItem('@' + this.state.category, JSON.stringify(this.state.correct + 1), () => {
                        Alert.alert(
                            this.state.correct + 1 + '/10',
                            'You have answered all questions in this category. Play other category now!',
                            [
                                { text: 'OK', onPress: () => this.nav.navigate("Main") },
                            ],
                            { cancelable: true },
                        );
                    });

                }
            } else {
                if (this.state.no < 10) {
                    this.setState({
                        no: this.state.no + 1,
                    }, () => {
                        this.playAudio(this.state.questions[this.state.no - 1].question + '.     ' + this.state.options[this.state.no - 1][0] + '.     ' + this.state.options[this.state.no - 1][1] + '.     ' + this.state.options[this.state.no - 1][2] + '.or.     ' + this.state.options[this.state.no - 1][3] + '.     ')
                    });
                    Alert.alert(
                        this.state.correct +'/10',
                        'Wrong Answer',
                        { cancelable: true }
                    );
                } else {
                    AsyncStorage.setItem('@' + this.state.category, JSON.stringify(this.state.correct), () => {
                        Alert.alert(
                            this.state.correct + '/10',
                            'You have answered all questions in this category. Play other category now!',
                            [
                                { text: 'OK', onPress: () => this.nav.navigate("Main") },
                            ],
                            { cancelable: true },
                        );
                    });
                }
            }
        }
    }

    render() {

        return (
            <View style={styles.container}>

                <View style={styles.questionView}>
                    <Text style={styles.text}>Question {this.state.no}{"\n"}</Text>
                    <Text style={[styles.text, { fontWeight: '500' }]}>{this.state.questions[this.state.no - 1].question}</Text>
                </View>

                <TouchableOpacity style={styles.view} onPress={() => this.optionSelected(this.state.options[this.state.no - 1][0])}>
                    <Text style={styles.text}>{this.state.options[this.state.no - 1][0]}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.view} onPress={() => this.optionSelected(this.state.options[this.state.no - 1][1])}>
                    <Text style={styles.text}>{this.state.options[this.state.no - 1][1]}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.view} onPress={() => this.optionSelected(this.state.options[this.state.no - 1][2])}>
                    <Text style={styles.text}>{this.state.options[this.state.no - 1][2]}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.view} onPress={() => this.optionSelected(this.state.options[this.state.no - 1][3])}>
                    <Text style={styles.text}>{this.state.options[this.state.no - 1][3]}</Text>
                </TouchableOpacity>

                <View style={{ flex: 5, alignItems: 'center', justifyContent: 'center', alignSelf: 'stretch', alignContent: 'center', }}>
                    <Text style={styles.correct}>Correct Answers: {this.state.correct}/10</Text>
                    <TouchableOpacity onPress={() => this._stopPlaybackAndBeginRecording()}>
                        <Text style={styles.text1}>Tap &amp; Speak Answer</Text>
                    </TouchableOpacity>
                </View>

            </View>
        );
    }
}

Quiz.propTypes = {
    question: PropTypes.string,
    questionNo: PropTypes.string,
    option1: PropTypes.string,
    option2: PropTypes.string,
    option3: PropTypes.string,
    option4: PropTypes.string,
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        flex: 1,
    },
    optionView: {
        alignSelf: 'stretch',
        flex: 1,
        flexDirection: 'row',
    },
    questionView: {
        flex: 2,
        marginTop: 32,
        marginLeft: 16,
        marginRight: 16,
        marginBottom: 16,
        borderColor: '#f3f3f3',
        borderWidth: 1,
        padding: 16,
        borderRadius: 16,
        backgroundColor: '#fff',
        shadowOpacity: 0.2,
        shadowRadius: 10,
        shadowColor: '#AB30E6',
        alignSelf: 'stretch',
    },
    view: {
        marginLeft: 16,
        marginRight: 16,
        marginBottom: 8,
        flex: 1,
        padding: 16,
        borderColor: '#f3f3f3',
        borderWidth: 1,
        borderRadius: 16,
        backgroundColor: '#fff',
        shadowOpacity: 0.2,
        shadowRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'stretch',
        alignContent: 'center',
        shadowColor: '#AB30E6',
    },
    text: {
        marginLeft: 20,
        marginRight: 20,
        color: '#000',
        justifyContent: 'center',
        textAlign: 'center',
        textAlignVertical: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        alignContent: 'center',
        fontFamily: 'AvenirNext-Regular',
        fontSize: 15,
    },
    correct: {
        marginLeft: 20,
        marginRight: 20,
        color: '#8FE90D',
        justifyContent: 'center',
        textAlign: 'center',
        fontWeight: '500',
        textAlignVertical: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        alignContent: 'center',
        fontFamily: 'AvenirNext-Regular',
        fontSize: 15,
    },
    text1: {
        marginLeft: 20,
        marginRight: 20,
        marginTop: 16,
        color: '#000',
        justifyContent: 'center',
        textAlign: 'center',
        fontWeight: '500',
        textAlignVertical: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        alignContent: 'center',
        fontFamily: 'AvenirNext-Regular',
        fontSize: 15,
    },
    green: {
        color: '#00ffff',
    },
    red: {
        color: '#ff0000',
    },
});
