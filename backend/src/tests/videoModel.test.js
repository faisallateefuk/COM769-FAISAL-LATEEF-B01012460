const Video = require("../models/video_model");

describe("Video model validation", () => {
  it("should require a title", () => {
    const v = new Video({
      blobUrl: "https://example.com/video.mp4",
    });

    const error = v.validateSync();
    expect(error).toBeDefined();
    expect(error.errors).toHaveProperty("title");
  });

  it("should be valid when title and blobUrl are provided", () => {
    const v = new Video({
      title: "Test video",
      blobUrl: "https://example.com/video.mp4",
    });

    const error = v.validateSync();
    expect(error).toBeUndefined();
  });
});
