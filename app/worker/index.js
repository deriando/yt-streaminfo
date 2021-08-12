addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request));
});

async function getYouTubeData(yt_id) {
  const url = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet&part=liveStreamingDetails&id=${yt_id}&key=${YOUTUBE_API_KEY}`;
  try {
    let data = await fetch(url);
    data = await data.json();
    // thumbnail, scheduled start time, actual start & end time, etc
    const liveStreamingDetails = data.items[0];
    return JSON.stringify(liveStreamingDetails);
  } catch (e) {
    return e;
  }
}

async function handleRequest(request) {
  // regex for YouTube video ID
  const regex = /([\w-]{11})/gi;
  const yt_id = request.url.match(regex);
  // fetch YouTube API and return desired data
  const result = await getYouTubeData(yt_id);
  return new Response(result, {
    headers: { "content-type": "application/json" },
  });
}
