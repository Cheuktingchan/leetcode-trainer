import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabase';
import { RootStackParamList } from '../routes/navigationTypes';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import React from 'react';
import {
  FlatList,
  Text,
  View,
  StyleSheet,
  TextInput,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import ProblemListCard from './ProblemListCard';

interface Problem {
  id: number;
  title: string;
  difficulty: string;
  relatedTopics: string;
}

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
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const ITEMS_PER_PAGE = 10;

  // Separate function to fetch playlist problems
  const fetchPlaylistProblems = async () => {
    try {
      const { data: playlistData, error: playlistError } = await supabase
        .from('playlist_problems')
        .select('problem_id')
        .eq('playlist_id', playlistId);

      if (playlistError) throw playlistError;

      const problemIdsInPlaylist = (playlistData || []).map(p => p.problem_id);

      const { data: problemsData, error: problemsError } = await supabase
        .from('problems')
        .select('id, title, difficulty, related_topics')
        .in('id', problemIdsInPlaylist);

      if (problemsError) throw problemsError;

      // Map related_topics to relatedTopics to match the Problem interface
      const mappedProblems = (problemsData || []).map(p => ({
        ...p,
        relatedTopics: p.related_topics,
      }));

      setPlaylistProblems(mappedProblems);
    } catch (error) {
      console.error('Failed to fetch playlist problems:', error);
      Alert.alert('Error', 'Could not fetch playlist problems');
    }
  };

  const fetchProblems = async (pageNumber: number, search: string = '') => {
    try {
      setLoading(true);
      const from = pageNumber * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;

      let query = supabase
        .from('problems')
        .select('id, title, difficulty, related_topics')
        .range(from, to);

      if (search) {
        query = query.ilike('title', `%${search}%`);
      }

      const { data: newProblems, error } = await query;

      console.log('newProblems', newProblems);

      if (error) throw error;

      // Map related_topics to relatedTopics to match the Problem interface
      const mappedNewProblems = (newProblems || []).map(p => ({
        ...p,
        relatedTopics: p.related_topics,
      }));

      if (pageNumber === 0) {
        setProblems(mappedNewProblems);
      } else {
        setProblems(prev => [...prev, ...mappedNewProblems]);
      }

      setHasMore((newProblems || []).length === ITEMS_PER_PAGE);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to fetch problems');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProblems(0, searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    fetchPlaylistProblems();
  }, [playlistId]);

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      setPage(prev => prev + 1);
      fetchProblems(page + 1, searchQuery);
    }
  };

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

  const renderFooter = () => {
    if (!loading) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color="#0000ff" />
      </View>
    );
  };

  const renderEmptyList = (message: string) => {
    if (loading) return null;
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>{message}</Text>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>{playlistName}:</Text>

        <TextInput
          style={styles.input}
          placeholder="Search problems..."
          value={searchQuery}
          onChangeText={text => {
            setSearchQuery(text);
            setPage(0);
            setProblems([]);
          }}
        />

        <Text style={styles.sectionTitle}>All Problems:</Text>
        <View style={styles.listContainer}>
          <FlatList
            data={problems}
            keyExtractor={item => item.id.toString()}
            scrollEnabled={true}
            nestedScrollEnabled={true}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            ListFooterComponent={renderFooter}
            ListEmptyComponent={() =>
              renderEmptyList(
                searchQuery ? 'No problems found matching your search' : 'No problems available'
              )
            }
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
        </View>

        <Text style={styles.sectionTitle}>Problems in this Playlist:</Text>
        <View style={styles.listContainer}>
          <FlatList
            data={playlistProblems}
            keyExtractor={item => item.id.toString()}
            scrollEnabled={true}
            nestedScrollEnabled={true}
            ListEmptyComponent={() => renderEmptyList('No problems added to this playlist yet')}
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
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 15,
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
    marginTop: 10,
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
  listContainer: {
    height: 300,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    marginVertical: 5,
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    height: 200,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default PlaylistProblems;
