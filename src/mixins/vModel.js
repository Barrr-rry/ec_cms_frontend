export default {
  props: {
    value: {},
  },
  data() {
    return {
      input: this.value,
    }
  },
  watch: {
    input(val) {
      this.$emit('input', val)
    },
    value(val) {
      this.input = val
    },
  },
}
