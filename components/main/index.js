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
            { text: "General Knowledge", image: "/Users/thisisnsh/Desktop/projects/quiz/assets/gk.png" },
            { text: "Books", image: "/Users/thisisnsh/Desktop/projects/quiz/assets/book.png" },
            { text: "Movies", image: "/Users/thisisnsh/Desktop/projects/quiz/assets/movie.png" },
            { text: "Music", image: "/Users/thisisnsh/Desktop/projects/quiz/assets/music.png" },
            { text: "Television", image: "/Users/thisisnsh/Desktop/projects/quiz/assets/tv.png" },
            { text: "Video Games", image: "/Users/thisisnsh/Desktop/projects/quiz/assets/game.png" },
            { text: "Science & Nature", image: "/Users/thisisnsh/Desktop/projects/quiz/assets/nature.png" },
            { text: "Computers", image: "/Users/thisisnsh/Desktop/projects/quiz/assets/computer.png" },
            { text: "Geography", image: "/Users/thisisnsh/Desktop/projects/quiz/assets/earth.png" },
            { text: "History", image: "/Users/thisisnsh/Desktop/projects/quiz/assets/history.png" },
            { text: "Art", image: "/Users/thisisnsh/Desktop/projects/quiz/assets/art.png" },
            { text: "Sport", image: "/Users/thisisnsh/Desktop/projects/quiz/assets/sport.png" },
            { text: "Animals", image: "/Users/thisisnsh/Desktop/projects/quiz/assets/animal.png" },
            { text: "Vehicles", image: "/Users/thisisnsh/Desktop/projects/quiz/assets/car.png" },];

        this.state = {
            dataSource: this.ds.cloneWithRows(this.categories),
        };

        this.renderRow = this.renderRow.bind(this)
    }

    renderRow(rowData) {
        return <Category text={rowData.text} image={rowData.image} navigation={this.props.navigation}/>
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