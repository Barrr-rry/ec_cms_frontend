import {mapState} from 'vuex'

export default {
  computed: {
    ...mapState('configsetting', {
      configsetting: state => state.item
    }),
  },
}
