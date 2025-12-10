// frontend/src/VideoUpload.jsx
import { useState } from "react";
import axios from "axios";

const API_BASE =
    import.meta.env.VITE_API_BASE || "https://com769-b01012460-staging.azurewebsites.net";

export default function VideoUpload({ onUploaded }) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [uploaderId, setUploaderId] = useState("maxi"); // or leave blank
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!file) {
            setError("Please choose a video file.");
            return;
        }
        if (!title.trim()) {
            setError("Title is required.");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("title", title);
        formData.append("description", description);
        formData.append("uploaderId", uploaderId);

        try {
            setLoading(true);
            const res = await axios.post(
                `${API_BASE}/api/videos/upload`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            setSuccess("Video uploaded successfully!");

            // Clear form
            setTitle("");
            setDescription("");
            setFile(null);

            // Let parent refresh list
            if (onUploaded) onUploaded(res.data);
        } catch (err) {
            console.error(err);
            setError(
                err.response?.data?.message || "Upload failed. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ border: "1px solid #ddd", padding: 20, paddingRight: 34, borderRadius: 8, marginBottom: 24 }}>
            <h2>Upload a Video</h2>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: 8 }}>
                    <label>
                        Title*<br />
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            style={{ width: "100%", padding: 6 }}
                            required
                        />
                    </label>
                </div>

                <div style={{ marginBottom: 8 }}>
                    <label>
                        Description<br />
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                            style={{ width: "100%", padding: 6 }}
                        />
                    </label>
                </div>

                <div style={{ marginBottom: 8 }}>
                    <label>
                        Uploader ID (optional)<br />
                        <input
                            type="text"
                            value={uploaderId}
                            onChange={(e) => setUploaderId(e.target.value)}
                            style={{ width: "100%", padding: 6 }}
                        />
                    </label>
                </div>

                <div style={{ marginBottom: 8 }}>
                    <label>
                        Video file*<br />
                        <input
                            type="file"
                            accept="video/*"
                            onChange={(e) => setFile(e.target.files[0] || null)}
                        />
                    </label>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        padding: "8px 16px",
                        cursor: loading ? "not-allowed" : "pointer",
                    }}
                >
                    {loading ? "Uploading..." : "Upload"}
                </button>

                {error && (
                    <p style={{ color: "red", marginTop: 8 }}>
                        {error}
                    </p>
                )}
                {success && (
                    <p style={{ color: "green", marginTop: 8 }}>
                        {success}
                    </p>
                )}
            </form>
        </div>
    );
}
