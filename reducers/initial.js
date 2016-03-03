module.exports = {
  view: 'overview',
  detail: {
    selection: {},
    logs: {
      entries: [],
      loading: false
    },
    template: {
      fields: {}, 
      loading: false
    },
    progress: {}
  },
  overview: {
    list: {
      loading: true,
      entries: [
        {
          name: 'binder-project/example-requirements',
          stage: 'building',
          deployed: 9,
          visible: true
        },
        {
          name: 'binder-project/example-dockerfile',
          stage: 'deployed',
          deployed: 5,
          visible: true
        },
        {
          name: 'binder-project/example-conda',
          stage: 'error',
          deployed: 25,
          visible: true
        }
      ]
    }
  }
}