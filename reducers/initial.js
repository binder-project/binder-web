module.exports = {

  // DB state
  binders: {
    loading: false,
    failed: false,
    bindersByName: {
      'binder-project/example-requirements': {
        stage: 'building',
        deployed: 9,
        visible: true,
        templates: {}
      },
      'binder-project/example-dockerfile': {
        stage: 'deployed',
        deployed: 5,
        visible: true,
        template: {}
      },
      'binder-project/example-conda': {
        stage: 'error',
        deployed: 25,
        visible: true,
        template: {}
      }
    }
  },

  selected: {
    loading: false,
    failed: false,
    binderId: null,
    status: null
  },

  // UI state

  detail: {
    selection: null,
    logs: {
      entries: []
    },
    template: {
      fields: {}
    },
    progress: 'started'
  },

  overview: {
    list: {
      entries: [
        'binder-project/example-requirements',
        'binder-project/example-dockerfile',
        'binder-project/example-conda'
      ]
    }
  }
}
