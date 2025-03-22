import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { supabase } from '../utils/supabase';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../routes/navigationTypes';

type ProblemCardNavigationProp = StackNavigationProp<RootStackParamList, 'ProblemCard'>;
type ProblemCardRouteProp = RouteProp<RootStackParamList, 'ProblemCard'>;

interface ProblemCardProps {
  navigation: ProblemCardNavigationProp;
  route: ProblemCardRouteProp;
}

const ProblemCard: React.FC<ProblemCardProps> = ({ route }) => {
  const { problemId } = route.params;
  const [problem, setProblem] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProblem = async () => {
      const { data, error } = await supabase
        .from('problems')
        .select('*')
        .eq('id', problemId)
        .single();

      if (error) {
        console.error('Error fetching problem:', error);
      } else {
        setProblem(data);
      }
      setLoading(false);
    };

    fetchProblem();
  }, [problemId]);

  if (loading) {
    return <ActivityIndicator size="large" color="#007AFF" />;
  }

  if (!problem) {
    return <Text style={styles.errorText}>Problem not found</Text>;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{problem.title}</Text>
      <Text style={styles.info}>Difficulty: {problem.difficulty}</Text>
      <Text style={styles.info}>Related Topics: {problem.related_topics}</Text>
      <Text style={styles.description}>{problem.description || 'No description available.'}</Text>
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
  errorText: {
    fontSize: 16,
    color: 'red',
  },
});

export default ProblemCard;