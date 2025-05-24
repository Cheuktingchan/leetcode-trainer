import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
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
