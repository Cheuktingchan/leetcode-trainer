import { useEffect, useState } from "react";
import { supabase } from "../utils/supabase";
import { RootStackParamList } from "../routes/navigationTypes";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import React from "react";
import { Text, View } from "react-native";

type PlaylistProblemsNavigationProp = StackNavigationProp<RootStackParamList, 'PlaylistProblems'>;

interface PlaylistProblemsProps {
    navigation: PlaylistProblemsNavigationProp;
    route: RouteProp<RootStackParamList, 'PlaylistProblems'>;
}

const PlaylistProblems: React.FC<PlaylistProblemsProps> = ({ navigation, route }) => {
    const { playlistId, playlistName } = route.params;
    const [problems, setProblems] = useState<any[]>([]);

    useEffect(() => {

        async function getProblems() {
            try {
                let { data, error, status } = await supabase
                    .from("problems")
                    .select()

                if (error && status !== 406) {
                    throw error;
                }

                if (data) {
                    setProblems(data.map((item) => ({
                        id: item.id,
                        title: item.title,
                        difficulty: item.difficulty,
                        relatedTopics: item.related_topics
                    })));
                }
            } catch (error) {
                setProblems([]);
            }
        }
        getProblems();
    }, []);
    return (
        <View>
            <Text>{playlistName} (ID: {playlistId})</Text>
            {/* Load problems for this playlist */}
        </View>
    );
};

export default PlaylistProblems;