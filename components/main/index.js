import React, { Component } from 'react';
import { ListView, ScrollView, View, StyleSheet } from 'react-native';
import Category from './category/index';

export default class Main extends Component {

    static navigationOptions = {
        title: 'Select Category',
        headerLeft: null
    };

    constructor(props) {
        super(props)

        this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.categories = [
            { text: "General Knowledge", image: "/Users/thisisnsh/Desktop/projects/quiz/assets/gk.png", category: "9"},
            { text: "Books", image: "/Users/thisisnsh/Desktop/projects/quiz/assets/book.png", category: "10" },
            { text: "Movies", image: "/Users/thisisnsh/Desktop/projects/quiz/assets/movie.png", category: "11" },
            { text: "Music", image: "/Users/thisisnsh/Desktop/projects/quiz/assets/music.png", category: "12" },
            { text: "Television", image: "/Users/thisisnsh/Desktop/projects/quiz/assets/tv.png", category: "14" },
            { text: "Video Games", image: "/Users/thisisnsh/Desktop/projects/quiz/assets/game.png", category: "15" },
            { text: "Science & Nature", image: "/Users/thisisnsh/Desktop/projects/quiz/assets/nature.png", category: "17" },
            { text: "Computers", image: "/Users/thisisnsh/Desktop/projects/quiz/assets/computer.png", category: "18" },
            { text: "Geography", image: "/Users/thisisnsh/Desktop/projects/quiz/assets/earth.png", category: "22" },
            { text: "History", image: "/Users/thisisnsh/Desktop/projects/quiz/assets/history.png", category: "23" },
            { text: "Art", image: "/Users/thisisnsh/Desktop/projects/quiz/assets/art.png", category: "25" },
            { text: "Sport", image: "/Users/thisisnsh/Desktop/projects/quiz/assets/sport.png", category: "21" },
            { text: "Animals", image: "/Users/thisisnsh/Desktop/projects/quiz/assets/animal.png", category: "27" },
            { text: "Vehicles", image: "/Users/thisisnsh/Desktop/projects/quiz/assets/car.png", category: "28" },];

        this.state = {
            dataSource: this.ds.cloneWithRows(this.categories),
        };

        this.renderRow = this.renderRow.bind(this)
    }

    componentDidMount() {
        console.log('asasasas')
        this.setState({
            dataSource: this.state.dataSource
        });
    }

    renderRow(rowData) {
        return <Category text={rowData.text} image={rowData.image} category={rowData.category} navigation={this.props.navigation}/>
    }

    render() {
        return (
            <View>
                <ScrollView>
                    <ListView
                        style={{ paddingBottom: 32, paddingTop: 32 }}
                        dataSource={this.state.dataSource}
                        renderRow={this.renderRow}
                    />
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});