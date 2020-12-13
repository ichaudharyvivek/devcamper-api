const getAnalytics = async () => {
  let response;
  await fetch(`${location.protocol}//${location.host}/api/v1/analytics`, {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({}),
  })
    .then((res) => res.json())
    .then((data) => (response = data));

  console.log(response);

  // Add CSS
  let stat = document.getElementById("analytics");
  stat.style.display = "block";
  stat.style.fontSize = "12px";
  stat.style.backgroundColor = "#ebebeb";
  stat.style.color = "#6e6e6e";
  stat.style.padding = "0.5em";
  stat.style.margin = "0 0 10px 0";
  stat.style.width = "fit-content";
  stat.style.borderRadius = "5px";

  // Set DOM
  stat.innerText = `Page Views: ${response.count}`;
};

const response = getAnalytics();
