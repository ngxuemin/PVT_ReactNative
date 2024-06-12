import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ResultsScreen = ({ route }) => {
    const { averageReactionTime, averageOutputLatency, averageInputLatency, averageFrameRate } = route.params;
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Average Reaction Time: {averageReactionTime.toFixed(2)} ms</Text>
            <Text style={styles.text}>Average Output Latency: {averageOutputLatency.toFixed(2)} ms</Text>
            <Text style={styles.text}>Average Input Latency: {averageInputLatency.toFixed(2)} ms</Text>
            <Text style={styles.text}>Average Frame Rate: {averageFrameRate.toFixed(2)} FPS</Text>
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
        fontSize: 24,
        fontWeight: 'bold',
    },
});

export default ResultsScreen;
