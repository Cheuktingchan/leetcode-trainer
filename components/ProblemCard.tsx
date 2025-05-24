import React, { useEffect, useState } from 'react';
import { Text, StyleSheet, ActivityIndicator } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { supabase } from '../utils/supabase';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../routes/navigationTypes';
import SolutionTab from './SolutionTab';
import SolveTab from './SolveTab';
import ProblemDetails from './ProblemDetails';

const Tab = createMaterialTopTabNavigator();

type ProblemCardNavigationProp = StackNavigationProp<RootStackParamList, 'ProblemCard'>;
type ProblemCardRouteProp = RouteProp<RootStackParamList, 'ProblemCard'>;

interface ProblemCardProps {
  navigation: ProblemCardNavigationProp;
  route: ProblemCardRouteProp;
}

interface Problem {
  id: number;
  title: string;
  description: string;
  difficulty: string;
  // Add other problem properties as needed
}

const ProblemCard: React.FC<ProblemCardProps> = ({ route }) => {
  const { problemId } = route.params;
  const [problem, setProblem] = useState<Problem | null>(null);
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

  if (loading) return <ActivityIndicator size="large" color="#007AFF" />;

  if (!problem) return <Text style={styles.errorText}>Problem not found</Text>;

  return (
    <Tab.Navigator>
      <Tab.Screen name="Problem Details">{() => <ProblemDetails problem={problem} />}</Tab.Screen>
      <Tab.Screen name="Solve">{() => <SolveTab problemId={problemId} />}</Tab.Screen>
      <Tab.Screen name="Solution">{() => <SolutionTab problemId={problemId} />}</Tab.Screen>
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  errorText: {
    fontSize: 16,
    color: 'red',
  },
});

export default ProblemCard;
