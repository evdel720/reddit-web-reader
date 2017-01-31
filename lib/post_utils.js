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
    data: { limit: 25, after: sessionStorage.getItem('last')}
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
  const links = setUpLinks();
  resp.data.children.forEach((child) => {
    const li = post(child.data, links);
    ul.append(li);
  });
  setUpLoading();
};

const setUpLinks = () => {
  const links = {
    upvote: "▲",
    downvote: "▼",
    save: "Save",
    hide: "Hide",
    upHandler: (id) => vote('t3_' + id, 1),
    downHandler: (id) => vote('t3_' + id, -1),
    saveHandler: (id) => commonAction('t3_' + id, 'save'),
    hideHandler: (id) => commonAction('t3_' + id, 'hide')
  };
  const section = sessionStorage.getItem('section');
  if (section === "upvoted" || section === "downvoted") {
    links.upvote = "";
    links.downvote = "⟲ unvote";
    links.downHandler = (id) => vote('t3_' + id, 0);
    // left it empty function to match all the syntax
    links.upHandler = (id) => {};
  } else if (section === "saved") {
    links.save = "Unsave";
    links.saveHandler = (id) => commonAction('t3_' + id, 'unsave');
  } else if (section === "hidden") {
    links.hide = "Unhide";
    links.hideHandler = (id) => commonAction('t3_' + id, 'unhide');
  }
  return links;
};

const setUpLoading = () => {
  const loading = $('#loading');
  loading.addClass('hidden');
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

const votes = (data, links) => {
  const div = $('<div></div>').addClass('votes');
  const up = $('<p></p>').text(links.upvote);
  const down = $('<p></p>').text(links.downvote);
  up.click(() => links.upHandler(data.id));
  down.click(() => links.downHandler(data.id));
  const count = $('<h4></h4>').text(` ${data.ups} `);
  div.append([up, count, down]);
  return div;
};

const left = (data, links) => {
  const div = $('<div></div>').addClass('left');
  const thumbnail = $('<img/>');
  // if it's not proper for work (or no image), don't show thumbnail
  const src = ['self', 'default', "nsfw"].includes(data.thumbnail) ? DEFAULT_IMG : data.thumbnail;
  thumbnail.attr('src', src);
  div.append([votes(data, links), thumbnail]);
  return div;
};

const below = (data, links) => {
  const div = $('<div></div>').addClass('below');
  const author = $('<h3></h3>').text(`👤 ${data.author}`);
  const subreddit = $('<h3></h3>').text(`🅂 ${data.subreddit}`);
  const numOfComments = $('<h5></h5>').text(`💬 ${data.num_comments}`);
  numOfComments.click(() => {
    window.location = `https://www.reddit.com/${data.permalink}`;
  });
  const saveLink = $('<h5></h5>').text(links.save);
  const hideLink = $('<h5></h5>').text(links.hide);
  saveLink.click(() => links.saveHandler(data.id));
  hideLink.click(() =>links.hideHandler(data.id));
  div.append([numOfComments, saveLink, hideLink, author, subreddit]);
  return div;
};

const post = (data, links) => {
  const li = $('<li></li>');
  const title = $('<h2></h2>').text(data.title);
  const titleDiv = $('<div></div>').append(title);
  const right = $('<div></div>').addClass('right');
  right.append([titleDiv, below(data, links)]);
  title.click(() => {
    window.location = data.url;
  });
  li.append([left(data, links), right]);
  return li;
};
