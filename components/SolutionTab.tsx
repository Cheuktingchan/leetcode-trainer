import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { supabase } from '../utils/supabase';
import CodeHighlighter from "react-native-code-highlighter";
import { atomOneDarkReasonable } from "react-syntax-highlighter/dist/esm/styles/hljs";


const SolutionTab: React.FC<{ problemId: number }> = ({ problemId }) => {
    const [solution, setSolution] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSolution = async () => {
            const { data, error } = await supabase
                .from('solutions')
                .select('*')
                .eq('number', problemId)
                .order('upvotes', { ascending: false })
                .limit(1);

            if (error) {
                console.error('Error fetching solution:', error);
            } else if (data.length > 0) {
                setSolution(data[0]);
            }
            setLoading(false);
        };

        fetchSolution();
    }, [problemId]);

    if (loading) return <ActivityIndicator size="large" color="#007AFF" />;

    if (!solution) return <Text style={styles.noSolution}>No solution available for this problem.</Text>;

    const codeWithLineNumbers = solution.python_solutions
        .split('\n')
        .map((line: string, index: number) => `${index + 1}: ${line}`)
        .join('\n');

    return (
        <ScrollView contentContainerStyle={styles.container} horizontal={false}>
            <Text style={styles.solutionTitle}>Solution by {solution.user}</Text>
            <Text>
                <CodeHighlighter
			hljsStyle={atomOneDarkReasonable}
			language="python"
                >
                    {codeWithLineNumbers}
                </CodeHighlighter>            </Text>
        </ScrollView>
    );
};

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

export default SolutionTab;