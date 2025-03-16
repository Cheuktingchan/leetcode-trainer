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