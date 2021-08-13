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

function handle_form() {
  const url = document.getElementById("id").value;
  const regex = /([\w-]{11})/gi;
  const yt_id = url.match(regex);
  console.log(yt_id[0]);

  window.location.assign(`/?id=${yt_id[0]}`);
}

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

      document.getElementById("app-name").remove();

      document.getElementById("App").innerHTML = `
      <div class="container">
        <image id="thumbnail" srcset="${thumbnails.standard.url} ${thumbnails.standard.width}" src=${thumbnails.standard.url} alt="">
        <div class="data-container">
            <div class="group">
              <p class="field-name">Title</p>
              <p class="data">${title}</p>
            </div>
            <div class="group">
              <p class="field-name">Channel Name</p>
              <p class="data">${channelTitle}</p>
            </div>

            <div class="group">
              <p class="field-name">Start Time</p>
              <p class="data">${startTime}</p>
            </div>
            <div class="group">
              <p class="field-name">End Time</p>
              <p class="data">${endTime}</p>
            </div>
          <div class="group">
            <p class="field-name">Time Since Stream</p>
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
          </div>
        </div>
      </div>
      `;
      break;

    default:
      document.getElementById("App").innerHTML = `
      <div class="container">
        <div class="form">
          <form onsubmit="handle_form(); return false;">
          <label for="id">Video ID:</label>
          <input type="text" id="id" name="id">
          <button type="submit">Submit</button>
          </form>
        </div>
      </div>
      `;
      break;
  }
}
