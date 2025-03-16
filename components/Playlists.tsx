import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet, FlatList } from "react-native";
import { supabase } from "../utils/supabase";
import PlaylistListCard, { Playlist } from "./PlaylistListCard";

const Playlists: React.FC<{ userId: string; }> = ({ userId }) => {
  const [playlistName, setPlaylistName] = useState("");
  const [loading, setLoading] = useState(false);
  const [playlists, setPlaylists] = useState<any[]>([]);

  async function getPlaylists() {
    try {
      let { data, error, status } = await supabase
        .from("playlists")
        .select()

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
      Alert.alert("Error", "Playlist name cannot be empty.");
      return;
    }

    const { data, error } = await supabase
      .from("playlists")
      .insert([
        { name: playlistName, user_id: userId },
      ])
      .select(); // Explicitly select the inserted rows

    if (error) {
      Alert.alert("Error", error.message);
    } else {
      Alert.alert("Success", "Playlist added!");

      // Add the newly inserted playlist to the existing playlists
      setPlaylists((prevPlaylists) => [
        ...prevPlaylists,
        ...data, // Add the newly inserted playlist(s)
      ]);
    }
  };
  useEffect(() => {
    getPlaylists();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={playlists}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <PlaylistListCard playlist={{ id: item.id.toString(), name: item.name }} />}
      />
      <Text style={styles.label}>Create a New Playlist</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter playlist name"
        value={playlistName}
        onChangeText={setPlaylistName}
      />
      <Button title={loading ? "Adding..." : "Add Playlist"} onPress={() => handleAddPlaylist(playlistName)} disabled={loading} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 3,
    marginVertical: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
});

export default Playlists;