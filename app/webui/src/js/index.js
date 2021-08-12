window.onload = () =>
  has_id_query() ? write_data_to_html(true) : write_data_to_html(false);

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

async function write_data_to_html(bool) {
  switch (bool) {
    case true:
      let data = await get_youtube_data();
      console.log(JSON.stringify(data));
      // document.getElementById("title").innerHTML();
      break;

    default:
      break;
  }
}
