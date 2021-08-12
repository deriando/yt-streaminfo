var init = () =>
  has_id_query() ? write_data_to_html(true) : write_data_to_html(false);

window.onload = init;

var query;

function has_id_query() {
  query = new URLSearchParams(window.location.search);
  if (query.has("id")) {
    return true;
  } else {
    return false;
  }
}

async function get_youtube_data() {
  let id = query.get("id");

  let response = await fetch(`/worker/data/${id}`);
  let data = await response.json();
  return data;
}

/* function handle_form(URL) {
  const regex = /([\w-]{11})/gi;
  const yt_id = URL.match(regex);
} */

async function write_data_to_html(bool) {
  switch (bool) {
    case true:
      let data = await get_youtube_data();
      let channelTitle = data.snippet.channelTitle;
      let title = data.snippet.title;
      let thumbnails = data.snippet.thumbnails;
      let scheduledStartTime = new Date(
        data.liveStreamingDetails.scheduledStartTime
      );
      let startTime = new Date(data.liveStreamingDetails.actualStartTime);
      let endTime = new Date(data.liveStreamingDetails.actualEndTime);

      let total_ms_SinceStartTime = Date.now() - startTime;
      let day_SinceStartTime = Math.floor(
        total_ms_SinceStartTime / (24 * 60 * 60 * 1000)
      );
      let hr_SinceStartTime = Math.floor(
        (total_ms_SinceStartTime - day_SinceStartTime * 24 * 60 * 60 * 1000) /
          (60 * 60 * 1000)
      );
      let min_SinceStartTime = Math.floor(
        (total_ms_SinceStartTime -
          day_SinceStartTime * 24 * 60 * 60 * 1000 -
          hr_SinceStartTime * 60 * 60 * 1000) /
          (60 * 1000)
      );

      document.getElementById("App").innerHTML = `
      <image src=${thumbnails.medium.url}>
      <h1 class="title">Title</h1>
      <h2 class="subtitle">${title}</h2>

      <h1 class="title">Channel Name</h1>
      <h2 class="subtitle">${channelTitle}</h2>

      <h1 class="title">Start Time</h1>
      <h2 class="subtitle">${startTime}</h2>

      <h1 class="title">End Time</h1>
      <h2 class="subtitle">${endTime}</h2>

      <h1 class="title">Time Since Stream</h1>
      <table class="table">
        <thead>
          <tr>
            <th>Day/s</th>
            <th>Hour/s</th>
            <th>Minute/s</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>${day_SinceStartTime}</td>
            <td>${hr_SinceStartTime}</td>
            <td>${min_SinceStartTime}</td>
          </tr>
        </tbody>
      </table>
      `;
      break;

    default:
      /* document.getElementById("App").innerHTML = `
      <form onsubmit="handle_form()">
      <label for="id">Video ID:</label>
      <input type="text" id="id" name="id">
      <button type="submit">Submit</button>
      </form>
      `; */
      break;
  }
}
