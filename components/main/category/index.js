import React, { Component } from 'react';
import { StyleSheet, Text, Image, View, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';

export default class Category extends Component {

    constructor(props) {
        super(props)
        this.arrowTapped = this.arrowTapped.bind(this)
    }

    arrowTapped(event) {
        this.props.navigation.navigate("Quiz", {question: "Rolex is a company that specializes in what type of product?", questionNo: "Question 1", option1: "Watches", option2: "Cars", option3: "Computers", option4: "Sports equipment"})
    }

    render() {
        return (
            <View style={styles.container}>
                <Image style={{ width: 50, height: 50, marginLeft: 16, marginRight: 16 }} source={{ uri: this.props.image }}></Image>
                <Text style={styles.text}>{this.props.text}</Text>
                <TouchableOpacity onPress={() => this.arrowTapped()}>
                    <Image style={{ width: 30, height: 30, marginLeft: 16, marginRight: 16 }} source={{ uri: '/Users/thisisnsh/Desktop/projects/quiz/assets/arrow.png' }}></Image>
                </TouchableOpacity>
            </View>
        );
    }
}

Category.propTypes = {
    text: PropTypes.string,
    image: PropTypes.string
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
