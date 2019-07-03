import React, { Component } from 'react';
import { StyleSheet, Text, Image, View, Alert, TouchableOpacity, AsyncStorage } from 'react-native';
import PropTypes from 'prop-types';

export default class Category extends Component {

    constructor(props) {
        super(props)
        this.arrowTapped = this.arrowTapped.bind(this)
        this.state = {
            text: this.props.text,
            played: false
        }
        this.faded = this.faded.bind(this)
    }

    componentDidMount() {
        AsyncStorage.getItem('@' + this.props.category, (err, result) => {
            if (result != null) {
                this.setState({
                    text: this.props.text + '\n' + result + '/10',
                    played: true
                })
            }
        });
    }

    faded = function () {
        if (this.state.played) {
            return {
                opacity: '0.7',
                backgroundColor: '#ddd',
                shadowColor: '#000'
            }
        }
        return {}
    }

    arrowTapped(event) {
        if (this.state.played) {
            Alert.alert(
                this.props.text,
                'Already Played. Play other category now!',
                [
                    {
                        text: 'Cancel',
                        onPress: () => console.log('Cancel Pressed'),
                        style: 'cancel',
                    }
                ],
                { cancelable: true },
            );
        } else {
            this.props.navigation.navigate("Quiz", { category: this.props.category, nav: this.props.navigation })
        }
    }



    render() {
        return (
            <View style={[styles.container, this.faded()]}>
                <Image style={{ width: 50, height: 50, marginLeft: 16, marginRight: 16 }} source={{ uri: this.props.image }}></Image>
                <Text style={styles.text}>{this.state.text}</Text>
                <TouchableOpacity onPress={() => this.arrowTapped()}>
                    <Image style={{ width: 30, height: 30, marginLeft: 16, marginRight: 16 }} source={{ uri: '/Users/thisisnsh/Desktop/projects/quiz/assets/arrow.png' }}></Image>
                </TouchableOpacity>
            </View>
        );
    }
}

Category.propTypes = {
    text: PropTypes.string,
    image: PropTypes.string,
    category: PropTypes.string,
};

const styles = StyleSheet.create({
    container: {
        marginLeft: 16,
        marginRight: 16,
        marginBottom: 16,
        padding: 16,
        borderRadius: 16,
        borderColor: '#f3f3f3',
        borderWidth: 1,
        backgroundColor: '#fff',
        shadowOpacity: 0.2,
        shadowRadius: 10,
        shadowColor: '#AB30E6',
        alignItems: 'center',
        flexDirection: 'row'
    },
    text: {
        flex: 1,
        marginLeft: 20,
        marginRight: 20,
        color: '#000',
        fontWeight: '500',
        fontFamily: 'AvenirNext-Regular',
        fontSize: 15,
    },
});
