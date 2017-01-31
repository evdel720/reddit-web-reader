const requestPosts = () => {
  $.ajax({
    type: "GET",
    url: `${REDDIT}/${sessionStorage.getItem('section')}`,
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
  const up = $('<p></p>').text("▲");
  const down = $('<p></p>').text("▼");
  const count = $('<h4></h4>').text(` ${data.ups} `);
  up.click(() => vote('t3_' + data.id, 1));
  down.click(() => vote('t3_' + data.id, -1));
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
  div.append([numOfComments, author, subreddit]);
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
