import React, { Component } from 'react';
import { StyleSheet, Text, Image, View, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';

export default class Quiz extends Component {

    static navigationOptions = {
        title: "",
    };

    constructor(props) {
        super(props)
        const { navigation } = this.props;
        this.questionNo = navigation.getParam('questionNo', '');
        this.question = navigation.getParam('question', '');
        this.option1 = navigation.getParam('option1', '');
        this.option2 = navigation.getParam('option2', '');
        this.option3 = navigation.getParam('option3', '');
        this.option4 = navigation.getParam('option4', '');
        console.log(this.questionNo)

        this.state = {
            question: this.question,
            questionNo: this.questionNo,
            option1: this.option1,
            option2: this.option2,
            option3: this.option3,
            option4: this.option4,
        }
        console.log(this.state.questionNo)

    }

    render() {
        return (
            <View style={styles.container}>

                <View style={styles.questionView}>
                    <Text style={styles.text}>{this.state.questionNo}{"\n"}</Text>
                    <Text style={[styles.text, {fontWeight: '500'}]}>{this.state.question}</Text>
                </View>

                <TouchableOpacity style={styles.view}>
                    <Text style={styles.text}>{this.state.option1}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.view}>
                    <Text style={styles.text}>{this.state.option2}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.view}>
                    <Text style={styles.text}>{this.state.option3}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.view}>
                    <Text style={styles.text}>{this.state.option4}</Text>
                </TouchableOpacity>
                <View style={{ flex: 5  }}></View>

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
});
