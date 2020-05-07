<template>
  <a-popover
    trigger="click"
    v-model="input"
    v-on="$listeners"
    v-bind="$attrs"
  >
    <template slot="content">
      <slot name="content"></slot>
      <div class="d-flex justify-content-end mt-12px">
        <a-button class="mr-16px" size="small" @click="cancel">取 消</a-button>
        <a-button type="primary" size="small" @click="ok">確 定</a-button>
      </div>
    </template>
    <slot></slot>
  </a-popover>
</template>

<script>
  import vModel from "../mixins/vModel"

  export default {
    mixins: [vModel],
    props: {
      openCallback: {
        default: null
      },
      disabled: {
        default: false
      }
    },
    data() {
      return {
        open_click_callback: false
      }
    },
    watch: {
      input(val) {
        if (val && this.disabled) {
          this.input = false
          return
        }
        this.$bus.has_popover = val
        if (!val) {
          this.open_click_callback = false
        }
      }
    },
    methods: {
      visibleChange() {
      },
      cancel() {
        this.input = false
      },
      ok() {
        this.$emit('ok', this.cancel)
      }
    },
    updated() {
      if (this.openCallback && !this.open_click_callback && this.input) {
        this.open_click_callback = true
        this.$nextTick(() => {
          this.openCallback()
        })
      }
    }
  }
</script>

<style scoped>
</style>
