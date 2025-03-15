import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView } from 'react-native';
import ProblemCard from './ProblemCard';
import { Session } from '@supabase/supabase-js';
import { supabase } from '../utils/supabase';

const problems = [
    { id: '1', title: 'Two Sum', difficulty: 'Easy', progress: 50 },
    { id: '2', title: 'Binary Search', difficulty: 'Medium', progress: 30 },
    { id: '3', title: 'Merge Intervals', difficulty: 'Hard', progress: 10 },
];

interface HomeProps {
    session: Session;
}

const Home: React.FC<HomeProps> = ({ session }) => {
    const user = session.user;
    const [username, setUsername] = useState<string | null>(null);

    useEffect(() => {
        async function getUsername() {
            try {
                let { data, error, status } = await supabase
                    .from("profiles")
                    .select(`username`)
                    .eq("id", user?.id)
                    .single();

                if (error && status !== 406) {
                    throw error;
                }

                if (data) {
                    setUsername(data.username);
                }
            } catch (error) {
                setUsername("User");
            }
        }

        getUsername();
    }, [session, supabase, user?.id]);

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Welcome, {username}!</Text>
            <FlatList
                data={problems}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <ProblemCard problem={item} />}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
});

export default Home;
