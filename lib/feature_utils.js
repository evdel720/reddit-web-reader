const votingAction = {
  '0': 'Unvote',
  '1': 'Upvote',
  '-1': 'Downvote'
};

const vote = (id, dir) => {
  $.ajax({
    type: "POST",
    url: `${REDDIT}/api/vote`,
    crossDomain: true,
    beforeSend: (xhr) => {
      xhr.setRequestHeader('Authorization', `bearer ${sessionStorage.getItem('access_token')}`);
    },
    data: { id: id, dir: dir },
    success: () => {
      window.location.reload(true);
      sessionStorage.setItem('notification', `${votingAction[dir]} recorded successfully.`);
    },
    error: showError
  });
};

const actionMessage = {
  save: "Saved",
  unsave: "Unsaved",
  hide: "Hidden",
  unhide: "Unhidden"
};

const commonAction = (id, action) => {
  $.ajax({
    type: "POST",
    url: `${REDDIT}/api/${action}`,
    crossDomain: true,
    beforeSend: (xhr) => {
      xhr.setRequestHeader('Authorization', `bearer ${sessionStorage.getItem('access_token')}`);
    },
    data: { id: id },
    success: () => {
      window.location.reload(true);
      sessionStorage.setItem('notification', `${actionMessage[action]} successfully.`);
    },
    error: showError
  });
};
