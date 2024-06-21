import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ResultsScreen = ({ route }) => {
    const { reactionTime, adjustedReactionTime, inputLatency, outputLatency, averageFrameRate } = route.params;
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Reaction Time: {reactionTime} ms</Text>
            <Text style={styles.text}>Adjusted Reaction Time: {adjustedReactionTime} ms</Text>
            <Text style={styles.text}>Output Latency: {outputLatency} ms</Text>
            <Text style={styles.text}>Input Latency: {inputLatency} ms</Text>
            <Text style={styles.text}>Average Frame Rate: {averageFrameRate} FPS</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default ResultsScreen;
