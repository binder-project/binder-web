var constants = {
  SHOW_DETAIL: 'SHOW_DETAIL',
  HIDE_DETAIL: 'HIDE_DETAIL',
  SHOW_LOADING: 'SHOW_LOADING',
  SHOW_ALL: 'SHOW_ALL',
  FILTER: 'FILTER',
  FETCH: 'FETCH'
}

function fetch () {
  return function (dx) {
    setTimeout(function () {
      dx({
        type: constants.FETCH,
        entries: [
          {
            name: 'binder-project/example-requirements',
            stage: 'building',
            deployed: 9,
            visible: true,
            template: 'language: python'
          },
          {
            name: 'binder-project/example-dockerfile',
            stage: 'deployed',
            deployed: 5,
            visible: true,
            template: 'language: js'
          },
          {
            name: 'binder-project/example-conda',
            stage: 'error',
            deployed: 25,
            visible: true,
            template: 'language: r'
          }
        ]
      })
    }, 400)
  }
}

function submit (value) {
  return function (dx) {
    dx({ type: constants.SHOW_LOADING })
    setTimeout(function () {
      dx({
        type: constants.SHOW_DETAIL,
        entry: {
          name: 'binder-project/example-requirements',
          stage: 'building',
          deployed: 9,
          visible: true,
          template: 'language: python'
        }
      })
    }, 400)
  }
}

module.exports = {
  constants: constants,
  fetch: fetch,
  submit: submit
}