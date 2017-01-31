const votingAction = {
  '0': 'Unvoting',
  '1': 'Upvoting',
  '-1': 'Downvoting'
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
      sessionStorage.setItem('notification', `${votingAction[dir]} is succeeded.`);
    },
    error: showError
  });
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
      sessionStorage.setItem('notification', `${action}d successful.`);
    },
    error: showError
  });
};
