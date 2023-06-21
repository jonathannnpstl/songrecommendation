mood = "";
moods = ["sleep", "club", "dance", "robot", "evil", "study", "sad", "lit"];

$(".reply").click(function () {
  createReply($(this).html(), "right");
  let response = $(this).attr("id");
  //if response is "yes" it doesn't update the mood,
  //instead it will generate songs related to previous mood selected.
  //if it is a mood, then update the mood and use it to generate songs.
  if (moods.includes(response)) {
    mood = response;
  }
  recommendSequence(mood); //for recommending

  if (response === "no") {
    recommendEndSequence();
    $(".yes-no").hide(2);
    return;
  }
  if ($(".mood").is(":hidden") && response !== "yes") {
    $(".mood").show(2);
  } else {
    $(".mood").hide(2);
    $(".yes-no").hide(2);
  }
});

/**
 *
 * @param {html element} el
 * @param {string} align | "left" or "right"
 */
function createReply(el, align) {
  appendMessage({ align: align, msg: el, delay: 1000 });
}

/**
 *
 * @param {string} mood | mood
 */
async function getRecommendedSongs(mood) {
  const response = await fetch(`http://127.0.0.1:5000/recommend/${mood}`);
  const jsonData = await response.json();
  createIframes(jsonData, "left");
}

function recommendEndSequence() {
  setTimeout(function () {
    createReply("Okay.", "left");
    setTimeout(function () {
      createReply("Just tell me your mood anytime.", "left");
      $(".mood").show(2);
    }, 1000);
  }, 1000);
}

/**
 *
 * @param {string} mood | mood
 */
function recommendSequence(mood) {
  setTimeout(function () {
    createReply("Okay, hold on.", "left");
    setTimeout(function () {
      getRecommendedSongs(mood);
      setTimeout(function () {
        createReply("Do you want more of these?", "left");
        $(".yes-no").show(2);
      }, 7000);
    }, 1000);
  }, 1000);
}

function onRowAdded() {
  $(".chat-container").animate({
    scrollTop: $(".chat-container").prop("scrollHeight"),
  });
}

/**
 *
 * @param {string} id | track id string
 * @returns {html element}
 */
function createIframe(id) {
  var iframe =
    "<iframe style=border-radius:12px src=https://open.spotify.com/embed/track/" +
    id +
    "?utm_source=generator width=100% height=80 frameBorder=0 allowfullscreen= allow=autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture loading=lazy></iframe>";
  return iframe;
}

/**
 *
 * @param {string} ids | track id string
 * @param {string} align | "left" or "right"
 */

function createIframes(ids, align) {
  let string = "";
  ids.forEach((id) => {
    string += createIframe(id);
  });
  appendMessage({ align: align, msg: string, delay: 6000 });
}

/**
 *
 * @returns string
 */
function getCurrentTime() {
  var d = new Date(); // for now
  return d.getHours() + ":" + d.getMinutes();
}

/**
 *
 * @param {object} msg
 */
function appendMessage(msg) {
  $(".chat-message-list").append(
    "<li class='message-" +
      msg.align +
      " " +
      "' ><div class='sp" +
      "'><span class='spinme-" +
      msg.align +
      "'><div class='spinner'><div class='bounce1'></div><div class='bounce2'></div><div class='bounce3'></div></div></span></div>" +
      "<div class='messageinner" +
      "'hidden ><span class='message-text'>" +
      msg.msg +
      "</span>" +
      "<span class='message-time'>" +
      getCurrentTime() +
      "</span>" +
      "</div></li>"
  );

  let p = $(".chat-message-list li").last().find(".sp");
  let p1 = $(".chat-message-list li").last().find(".messageinner");
  $(p).delay(msg.delay).hide(1);
  $(p1).delay(msg.delay).fadeIn();
  onRowAdded();
}

//hover effect on replies
$(function () {
  $(".gif").hover(
    function () {
      let mood = $(this).attr("id");
      $(this)
        .find("img")
        .attr("src", "./static/assets/emojis/" + mood + ".gif");
    },
    function () {
      let mood = $(this).attr("id");
      $(this)
        .find("img")
        .attr("src", "./static/assets/emojis/" + mood + ".png");
    }
  );
});

function start() {
  createReply("Tell me how you feel.", "left");
  $(".yes-no").hide(0);
}

start();
