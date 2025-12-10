import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000";

export default function VideosList() {
    const [videos, setVideos] = useState([]);

    useEffect(() => {
        axios.get(`${API_BASE}/api/videos`)
            .then(res => setVideos(res.data.items))
            .catch(console.error);
    }, []);

    return (
        <div style={{ maxWidth: 800, margin: "0 auto", padding: 16 }}>
            <h1>ClipCloud</h1>
            <p>Mini TikTok-style video feed</p>

            <section>
                {videos.map(v => (
                    <div key={v._id} style={{ marginBottom: 24, border: "1px solid #ddd", padding: 12 }}>
                        <h3>{v.title}</h3>
                        <p>{v.description}</p>
                        {v.thumbnailUrl && <img src={v.thumbnailUrl} alt={v.title} width={200} />}
                        <p>Likes: {v.likes}</p>
                    </div>
                ))}
            </section>
        </div>
    );
}
