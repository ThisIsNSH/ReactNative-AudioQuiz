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
        this.category = navigation.getParam('category', '9');

        this.state = {
            no: 1,
            correct: 0,
            category: this.category,
            questions: [{ question: 'Question', correct_answer: 'Option 1', incorrect_answers: ['Option 2', 'Option 3', 'Option 4'] }]
        }

        this.questions = []
        fetch('https://opentdb.com/api.php?amount=10&encode=url3986&type=multiple&category=' + this.state.category, {
            method: 'GET',
        }).then((response) => response.json())
            .then((responseJson) => {
                for (var i = 0; i < responseJson.results.length; i++) {
                    this.questions.push({ question: decodeURIComponent(responseJson.results[i].question), correct_answer: decodeURIComponent(responseJson.results[i].correct_answer), incorrect_answers: responseJson.results[i].incorrect_answers.map(x => decodeURIComponent(x)) })
                }
                this.setState({
                    questions: this.questions
                })
            })
            .catch((error) => {
                console.error(error);
            });

        this.optionSelected = this.optionSelected.bind(this)
    }

    optionSelected(text) {
        if (text == this.state.questions[this.state.no - 1].correct_answer) {
            this.setState({
                no: this.state.no + 1,
                correct: this.state.correct + 1
            })
        } else {
            this.setState({
                no: this.state.no + 1,
            })
        }
    }

    render() {

        return (
            <View style={styles.container}>

                <View style={styles.questionView}>
                    <Text style={styles.text}>Question {this.state.no}{"\n"}</Text>
                    <Text style={[styles.text, { fontWeight: '500' }]}>{this.state.questions[this.state.no - 1].question}</Text>
                </View>

                <TouchableOpacity style={styles.view} onPress={() => this.optionSelected(this.state.questions[this.state.no - 1].correct_answer)}>
                    <Text style={styles.text}>{this.state.questions[this.state.no - 1].correct_answer}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.view} onPress={() => this.optionSelected(this.state.questions[this.state.no - 1].incorrect_answers[0])}>
                    <Text style={styles.text}>{this.state.questions[this.state.no - 1].incorrect_answers[0]}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.view} onPress={() => this.optionSelected(this.state.questions[this.state.no - 1].incorrect_answers[1])}>
                    <Text style={styles.text}>{this.state.questions[this.state.no - 1].incorrect_answers[1]}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.view} onPress={() => this.optionSelected(this.state.questions[this.state.no - 1].incorrect_answers[2])}>
                    <Text style={styles.text}>{this.state.questions[this.state.no - 1].incorrect_answers[2]}</Text>
                </TouchableOpacity>

                <View style={{ flex: 5, alignItems: 'center', justifyContent: 'center', alignSelf: 'stretch', alignContent: 'center', }}>
                    <Text style={styles.correct}>Correct Answers: {this.state.correct}/10</Text>
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
        fontWeight: '500' ,
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
