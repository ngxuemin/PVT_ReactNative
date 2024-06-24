import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, InteractionManager } from 'react-native';

const TestScreen = ({ navigation }) => {
    const [showDot, setShowDot] = useState(false);
    const dotAppearanceTime = useRef(null);
    const timerRef = useRef(null);
    const [reactionTimes, setReactionTimes] = useState([]); // Keep track of reaction times
    const reactionTimesRef = useRef([]); // Ref to keep track of latest reaction times
    const [counter, setCounter] = useState(0); // Counter to keep track of number of dots that appeared
    const counterRef = useRef(0); // Ref to keep track of total number of dots that appeared
    const testEndedRef = useRef(false); // Ref to indicate whether the test has ended
    const backendDotTime = useRef([]); // Time when the backend schedules the dot
    const outputLatenciesRef = useRef([]); // Ref to keep track of latest output latencies
    const frontendRegistersClick = useRef([]); // Keep track of when frontend registers user's click
    const [registerClick, setRegisterClick] = useState(false);
    const backendRegistersClick = useRef([]); // Keep track of when backend registers user's click
    const inputLatenciesRef = useRef([]); // Ref to keep track of latest input latencies
    const frameDurations = useRef([]); // Ref to store frame durations

    useEffect(() => {
        if (testEndedRef.current == false) {
            const checkFrameRate = () => {
                const start = performance.now();
                requestAnimationFrame(() => {
                    const end = performance.now();
                    const duration = end - start;
                    frameDurations.current.push(duration);
                });
            }
            const interval = setInterval(checkFrameRate, 1000); // Check frame rate every second
            // Start the first dot appearance after 2 seconds
            timerRef.current = setTimeout(() => {
                // Synchronize with display refresh rate
                // Code runs right before the next repaint/next screen refresh
                requestAnimationFrame(() => {
                    backendDotTime.current = performance.now(); // Record backend time when dot is scheduled
                    setShowDot(true);
                    dotAppearanceTime.current = performance.now(); // Record the time the dot appears

                    // Calculate and store output latency of first dot
                    const outputLatency = dotAppearanceTime.current - backendDotTime.current;
                    outputLatenciesRef.current.push(outputLatency);
                    console.log("Output latency of first dot:", outputLatency);
                });
            }, 2000); // 2 seconds

            // Cleanup
            return () => {
                clearTimeout(timerRef.current);
                clearInterval(interval);
            };
        };
    }, [navigation]);

    const handlePress = () => {
        if (showDot) {
            // Calculate reaction time
            const reactionTime = performance.now() - dotAppearanceTime.current;
            console.log("Reaction time:", reactionTime);
            reactionTimesRef.current.push(reactionTime);

            // Store the number of dots appeared
            setCounter((prevCounter) => {
                const newCounter = prevCounter + 1;
                counterRef.current = newCounter; // Update the ref
                return newCounter;
            });

            // Handle input latency
            frontendRegistersClick.current = performance.now();
            setRegisterClick(true);
            backendRegistersClick.current = performance.now();
            const inputLatency = backendRegistersClick.current - frontendRegistersClick.current;
            inputLatenciesRef.current.push(inputLatency);
            console.log("Input latency:", inputLatency);

            setShowDot(false);

            // Log times and navigate to results
            logTimes();
        }
    };

    const logTimes = () => {
        const totalDuration = frameDurations.current.reduce((acc, curr) => acc + curr, 0);
        const averageDuration = totalDuration / frameDurations.current.length;
        const averageFrameRate = 1000 / averageDuration;
        const reactionTime = reactionTimesRef.current;
        const inputLatency = inputLatenciesRef.current;
        const outputLatency = outputLatenciesRef.current;
        console.log("Average frame rate:", averageFrameRate);
        console.log("Reaction time:", reactionTime);
        console.log("Input latency:", inputLatency);
        console.log("Output latency:", outputLatency);
        navigation.navigate('Results', { reactionTime, inputLatency, outputLatency, averageFrameRate });
    };

    return (
        <TouchableOpacity style={styles.container} onPress={handlePress}>
            {showDot && <View style={styles.redDot} />}
            <Text style={styles.text}>Press anywhere on the screen when the red dot appears.</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    redDot: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'red',
    },
    text: {
        marginTop: 20,
        fontSize: 16,
        textAlign: 'center',
    },
});

export default TestScreen;
