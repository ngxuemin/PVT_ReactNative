import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

const ResultsScreen = ({ route, navigation }) => {
    const { reactionTime, inputLatency, outputLatency, averageFrameRate } = route.params;
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Reaction Time: {reactionTime} ms</Text>
            {/* <Text style={styles.text}>Output Latency: {outputLatency} ms</Text>
            <Text style={styles.text}>Input Latency: {inputLatency} ms</Text>
            <Text style={styles.text}>Average Frame Rate: {averageFrameRate} FPS</Text> */}
            <Button
                title="Home"
                onPress={() => navigation.navigate('Home')}
            />
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
