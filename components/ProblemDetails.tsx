import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { supabase } from '../utils/supabase';

const ProblemDetails: React.FC<{ problem: any }> = ({ problem }) => (
    <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>{problem.title}</Text>
        <Text style={styles.info}>Difficulty: {problem.difficulty}</Text>
        <Text style={styles.info}>Related Topics: {problem.related_topics}</Text>
        <Text style={styles.description}>{problem.description || 'No description available.'}</Text>
    </ScrollView>
);

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    info: {
        fontSize: 16,
        marginBottom: 8,
    },
    description: {
        fontSize: 14,
        color: '#555',
        marginBottom: 20,
    },
    solutionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    noSolution: {
        color: '#888',
        fontStyle: 'italic',
        marginTop: 20,
    },
    errorText: {
        fontSize: 16,
        color: 'red',
    },
});

export default ProblemDetails;