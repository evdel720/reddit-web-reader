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
      // show some notification
      window.location.reload(true);
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
      // show some notification
      window.location.reload(true);
    },
    error: showError
  });
};

const actionSuccess = (action) => {
  
};
