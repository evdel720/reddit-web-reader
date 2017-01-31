const requestPosts = () => {
  let url = sessionStorage.getItem("section");
  if (sessionStorage.getItem("sectionType") === "history") {
    url = `user/${sessionStorage.name}/${url}`;
  }

  $.ajax({
    type: "GET",
    url: `${REDDIT}/${url}`,
    crossDomain: true,
    beforeSend: (xhr) => {
      xhr.setRequestHeader('Authorization', `bearer ${sessionStorage.getItem('access_token')}`);
    },
    data: { limit: 25, after: sessionStorage.getItem('last'), show: 'all' }
  }).done(renderPosts)
  .fail(showError);
};

const renderPosts = (resp) => {
  sessionStorage.setItem('last', resp.data.after);
  const ul = $('ul');
  if (resp.data.children.length === 0) {
    const noItem = $('<li></li>').text('Nothing in here in your account.');
    noItem.css('alignSelf', 'center');
    ul.append(noItem);
    return;
  }
  const loading = $('#loading');
  loading.addClass('hidden');
  resp.data.children.forEach((child) => {
    const li = post(child.data);
    ul.append(li);
  });
  const win = $(window);
  // for browser
  win.scroll(() => {
    if (loading.hasClass('hidden') && $(document).height() - win.height() === win.scrollTop()) {
			loading.removeClass('hidden');
      requestPosts();
		}
  });
  // for mobile
  win.on("touchmove", () => {
    if (loading.hasClass('hidden') && $(document).height() - win.height() <= window.scrollY + 10) {
			loading.removeClass('hidden');
      requestPosts();
		}
  });
};

const votes = (data) => {
  const div = $('<div></div>').addClass('votes');
  const up = $('<p></p>');
  const down = $('<p></p>');
  if (["upvoted", "downvoted"].includes(sessionStorage.getItem('section'))) {
    down.text("⟲ unvote");
    down.click(() => vote('t3_' + data.id, 0));
  } else {
    up.text("▲");
    down.text("▼");
    up.click(() => vote('t3_' + data.id, 1));
    down.click(() => vote('t3_' + data.id, -1));
  }
  const count = $('<h4></h4>').text(` ${data.ups} `);
  div.append([up, count, down]);
  return div;
};

const left = (data) => {
  const div = $('<div></div>').addClass('left');
  const thumbnail = $('<img/>');
  // if it's not proper for work (or no image), don't show thumbnail
  const src = ['self', 'default', "nsfw"].includes(data.thumbnail) ? DEFAULT_IMG : data.thumbnail;
  thumbnail.attr('src', src);
  div.append([votes(data), thumbnail]);
  return div;
};

const below = (data) => {
  const div = $('<div></div>').addClass('below');
  const author = $('<h3></h3>').text(`👤 ${data.author}`);
  const subreddit = $('<h3></h3>').text(`🅂 ${data.subreddit}`);
  const numOfComments = $('<h5></h5>').text(data.num_comments);
  numOfComments.click(() => {
    window.location = `https://www.reddit.com/${data.permalink}`;
  });
  const saveLink = $('<h5></h5>').text("Save");
  const hideLink = $('<h5></h5>').text("Hide");
  saveLink.click(() => {
    commonAction('t3_' + data.id, 'save');
  });
  hideLink.click(() => {
    commonAction('t3_' + data.id, 'hide');
  });
  div.append([numOfComments, saveLink, hideLink, author, subreddit]);
  return div;
};

const post = (data) => {
  const li = $('<li></li>');
  const title = $('<h2></h2>').text(data.title);
  const titleDiv = $('<div></div>').append(title);
  const right = $('<div></div>').addClass('right');
  right.append([titleDiv, below(data)]);
  title.click(() => {
    window.location = data.url;
  });
  li.append([left(data), right]);
  return li;
};
