import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { supabase } from '../utils/supabase';
import PlaylistListCard, { Playlist } from './PlaylistListCard';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../routes/navigationTypes';
import { RouteProp } from '@react-navigation/native';

interface PlaylistsProps {
  navigation: StackNavigationProp<RootStackParamList, 'Playlists'>;
  route: RouteProp<RootStackParamList, 'Playlists'>;
}

const Playlists: React.FC<PlaylistsProps> = ({ navigation, route }) => {
  const [playlistName, setPlaylistName] = useState('');
  const [loading, setLoading] = useState(false);
  const [playlists, setPlaylists] = useState<any[]>([]);

  const { userId } = route.params;

  async function getPlaylists() {
    try {
      const { data, error, status } = await supabase.from('playlists').select();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setPlaylists(data);
      }
    } catch (error) {
      setPlaylists([]);
    }
  }

  const handleAddPlaylist = async (playlistName: string) => {
    if (!playlistName.trim()) {
      Alert.alert('Error', 'Playlist name cannot be empty.');
      return;
    }

    const { data, error } = await supabase
      .from('playlists')
      .insert([{ name: playlistName, user_id: userId }])
      .select();

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      Alert.alert('Success', 'Playlist added!');

      // Add the newly inserted playlist to the existing playlists
      setPlaylists(prevPlaylists => [...prevPlaylists, ...data]);
    }
  };
  useEffect(() => {
    getPlaylists();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={playlists}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('PlaylistProblems', {
                playlistId: item.id,
                playlistName: item.name,
              })
            }
          >
            <PlaylistListCard playlist={{ id: item.id, name: item.name }} />
          </TouchableOpacity>
        )}
      />
      <Text style={styles.label}>Create a New Playlist</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter playlist name"
        value={playlistName}
        onChangeText={setPlaylistName}
      />
      <Button
        title={loading ? 'Adding...' : 'Add Playlist'}
        onPress={() => handleAddPlaylist(playlistName)}
        disabled={loading}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 3,
    marginVertical: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
});

export default Playlists;
