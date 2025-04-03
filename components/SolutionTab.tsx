import React, { useEffect, useState } from 'react';
import { View, Image, Text, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity, Alert, Button, Linking } from 'react-native';
import { supabase } from '../utils/supabase';
import CodeHighlighter from "react-native-code-highlighter";
import { atomOneDarkReasonable } from "react-syntax-highlighter/dist/esm/styles/hljs";
import WebView from 'react-native-webview';

const youtubeApiKey: string = process.env.EXPO_PUBLIC_YOUTUBE_API_KEY!;

const SolutionTab: React.FC<{ problemId: number }> = ({ problemId }) => {
    const [solution, setSolution] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [videoUrl, setVideoUrl] = useState("");
    const [thumbnailUrl, setThumbnailUrl] = useState("");
  
    const getYouTubeLink = async () => {
      if (!keyword) {
        alert("Please enter a search term");
        return;
      }
  
      try {
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
            keyword
          )}&maxResults=1&type=video&key=${youtubeApiKey}`
        );
  
        const data = await response.json();
  
        if (data.items && data.items.length > 0) {
          const videoId = data.items[0].id.videoId;
          const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
          const thumbnail = data.items[0].snippet.thumbnails.high.url;
  
          setVideoUrl(videoUrl);
          setThumbnailUrl(thumbnail);
        } else {
          setVideoUrl("");
          setThumbnailUrl("");
          alert("No video found");
        }
      } catch (error) {
        console.error("Error fetching YouTube video:", error);
        setVideoUrl("");
        setThumbnailUrl("");
        alert("Error fetching video");
      }
    };

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

    const keyword = solution.problem_title;
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
            <Text style={styles.heading}>YouTube Search</Text>
            <Button title="Search" onPress={getYouTubeLink} />
            {thumbnailUrl ? (
        <TouchableOpacity onPress={() => Linking.openURL(videoUrl)}>
          <Image source={{ uri: thumbnailUrl }} style={styles.thumbnail} />
        </TouchableOpacity>
      ) : null}

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
    heading: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
    },
    link: {
        marginTop: 20,
        color: "blue",
        textDecorationLine: "underline",
    },
    thumbnail: {
        width: 300,
        height: 180,
        marginTop: 20,
        borderRadius: 10,
      },
});

export default SolutionTab;