import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabase';
import { RootStackParamList } from '../routes/navigationTypes';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import React from 'react';
import { FlatList, Text, View, StyleSheet, TextInput, Alert } from 'react-native';
import ProblemListCard from './ProblemListCard';
import { Problem } from '../types/problem';

type PlaylistProblemsNavigationProp = StackNavigationProp<RootStackParamList, 'PlaylistProblems'>;

interface PlaylistProblemsProps {
  navigation: PlaylistProblemsNavigationProp;
  route: RouteProp<RootStackParamList, 'PlaylistProblems'>;
}

const PlaylistProblems: React.FC<PlaylistProblemsProps> = ({ navigation, route }) => {
  const { playlistId, playlistName } = route.params;
  const [problems, setProblems] = useState<Problem[]>([]);
  const [playlistProblems, setPlaylistProblems] = useState<Problem[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    async function fetchProblems() {
      try {
        const { data: allProblems, error } = await supabase.from('problems').select();

        if (error) throw error;

        setProblems(allProblems || []);

        // Fetch problems in the current playlist
        const { data: playlistData, error: playlistError } = await supabase
          .from('playlist_problems')
          .select('problem_id')
          .eq('playlist_id', playlistId);

        if (playlistError) throw playlistError;

        // Extract problem IDs in playlist
        const problemIdsInPlaylist = (playlistData || []).map(p => p.problem_id);

        // Filter problems that are already in the playlist
        const problemsInPlaylist = (allProblems || []).filter(p =>
          problemIdsInPlaylist.includes(p.id)
        );

        setPlaylistProblems(problemsInPlaylist);
      } catch (error) {
        console.error(error);
        setProblems([]);
        setPlaylistProblems([]);
      }
    }

    fetchProblems();
  }, [playlistId]);

  // Handle search filtering
  const filteredProblems = searchQuery
    ? problems.filter(problem => problem.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : problems;

  const addToPlaylist = async (problemId: number) => {
    try {
      // Prevent adding duplicates
      if (playlistProblems.some(p => p.id === problemId)) {
        Alert.alert('Info', 'Problem is already in the playlist.');
        return;
      }

      const { error } = await supabase
        .from('playlist_problems')
        .insert([{ playlist_id: playlistId, problem_id: problemId }]);

      if (error) throw error;

      // Update UI in real time
      const addedProblem = problems.find(p => p.id === problemId);
      if (addedProblem) {
        setPlaylistProblems(prev => [...prev, addedProblem]);
      }

      Alert.alert('Success', 'Problem added to playlist!');
    } catch (error) {
      console.error('Failed to add problem:', error);
      Alert.alert('Error', 'Could not add problem to playlist.');
    }
  };

  const handleNavigate = (problemId: number) => {
    navigation.navigate('ProblemCard', { problemId: problemId });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{playlistName}:</Text>

      {/* Search Bar */}
      <TextInput
        style={styles.input}
        placeholder="Search problems..."
        value={searchQuery}
        onChangeText={text => setSearchQuery(text)}
      />
      {/* All Problems with Add Option */}
      <Text style={styles.sectionTitle}>All Problems:</Text>
      <FlatList
        data={filteredProblems}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.problemItem}>
            <ProblemListCard
              problem={item}
              addToPlaylist={addToPlaylist}
              handleNavigate={handleNavigate}
            />
          </View>
        )}
      />

      {/* Problems in Playlist */}
      <Text style={styles.sectionTitle}>Problems in this Playlist:</Text>
      <FlatList
        data={playlistProblems}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.problemItem}>
            <ProblemListCard
              problem={item}
              addToPlaylist={function (id: number): void {
                throw new Error('Function not implemented.');
              }}
              handleNavigate={handleNavigate}
            />
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 5,
  },
  problemItem: {
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    backgroundColor: '#f9f9f9',
  },
});

export default PlaylistProblems;
