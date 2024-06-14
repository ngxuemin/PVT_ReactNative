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
                backendDotTime.current = Date.now(); // Record backend time when dot is scheduled
                setShowDot(true);
                dotAppearanceTime.current = Date.now(); // Record the time the dot appears

                // Calculate and store output latency of first dot
                const outputLatency = dotAppearanceTime.current - backendDotTime.current;
                outputLatenciesRef.current.push(outputLatency);
                console.log("Output latency of first dot:", outputLatency);
            }, 2000); // 2 seconds

            // Set the timeout to end the test after 1 minute
            const endTimeout = setTimeout(() => {
                testEndedRef.current = true; // Indicate that the test has ended
                logTimes();
                clearInterval(interval);
            }, 60000); // 1 minute

            // Cleanup
            return () => {
                clearTimeout(timerRef.current);
                clearTimeout(endTimeout);
            };
        };
    }, [navigation]);

    const handlePress = () => {
        if (showDot) {
            // Calculate reaction time
            const reactionTime = Date.now() - dotAppearanceTime.current;
            console.log("Reaction time:", reactionTime);

            // Store reaction times
            setReactionTimes((prevTimes) => {
                const updatedTimes = [...prevTimes, reactionTime];
                reactionTimesRef.current = updatedTimes; // Update the ref
                return updatedTimes;
            });

            // Store the number of dots appeared
            setCounter((prevCounter) => {
                const newCounter = prevCounter + 1;
                counterRef.current = newCounter; // Update the ref
                return newCounter;
            });

            // Handle input latency
            frontendRegistersClick.current = Date.now();
            setRegisterClick(true);

            // Send request to backend
            fetch('http://192.168.18.77:3000/register-click', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ timestamp: frontendRegistersClick.current })
            })
                .then(response => response.json())
                .then(data => {
                    backendRegistersClick.current = Date.now();
                    const inputLatency = backendRegistersClick.current - frontendRegistersClick.current;
                    inputLatenciesRef.current.push(inputLatency);
                    console.log("Input latency:", inputLatency);
                })
                .catch(error => {
                    console.error('Error registering click:', error);
                });

            setShowDot(false);

            // Schedule the next dot appearance after 2 seconds
            if (testEndedRef.current == false) {
                timerRef.current = setTimeout(() => {
                    if (testEndedRef.current == false) {
                        backendDotTime.current = Date.now(); // Record backend time when dot is scheduled
                        setShowDot(true);
                        dotAppearanceTime.current = Date.now(); // Record the time the dot appears

                        // Calculate and store output latency
                        const outputLatency = dotAppearanceTime.current - backendDotTime.current;
                        outputLatenciesRef.current.push(outputLatency);
                        console.log("Output latency:", outputLatency);
                    }
                }, 2000);
            }
        }
    };

    const logTimes = () => {
        const totalReactionTime = reactionTimesRef.current.reduce((acc, time) => acc + time, 0);
        const averageReactionTime = totalReactionTime / counterRef.current;
        const totalOutputLatency = outputLatenciesRef.current.reduce((acc, time) => acc + time, 0);
        const averageOutputLatency = totalOutputLatency / outputLatenciesRef.current.length;
        const totalInputLatency = inputLatenciesRef.current.reduce((acc, time) => acc + time, 0);
        const averageInputLatency = totalInputLatency / outputLatenciesRef.current.length;
        const totalDuration = frameDurations.current.reduce((acc, curr) => acc + curr, 0);
        const averageDuration = totalDuration / frameDurations.current.length;
        const averageFrameRate = 1000 / averageDuration;
        console.log("Output latency times to be saved:", outputLatenciesRef.current);
        console.log("Reaction times to be saved:", reactionTimesRef.current);
        console.log("Input latency times to be saved:", inputLatenciesRef.current);
        console.log("Frame durations to be saved:", frameDurations.current);
        console.log("Total frame duration:", totalDuration);
        console.log("Number of frames:", frameDurations.current.length);
        console.log("Total number of red dot appeared:", counterRef.current);
        console.log("Average output latency:", averageOutputLatency);
        console.log("Average reaction time:", averageReactionTime);
        console.log("Average input latency:", averageInputLatency);
        console.log("Average frame rate:", averageFrameRate);
        navigation.navigate('Results', { averageReactionTime, averageOutputLatency, averageInputLatency, averageFrameRate });
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
