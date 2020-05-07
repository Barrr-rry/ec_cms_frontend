<template>
  <a-drawer
    :width="computed_width"
    @close="close"
    ref="drawer"
    :closable="false"
    :visible="value"
  >
    <div slot="title">
      <div class="d-flex justify-content-between">
        <h3>{{title}}</h3>

      </div>
    </div>
    <div class="c-drawer-body">
      <slot></slot>
    </div>
    <a-divider/>
    <div class="c-drawer-footer">
      <slot name="footer">
        <div class="row justify-content-between">
          <div class="col-6">
            <c-popover
              @ok="$emit('delete',$event)"
            >
              <template slot="content">
                <p>
                  <a-icon type="close-circle-o" style="color: #f5222d; margin-right: 8px"/>
                  確定要{{deleteText.split(' ').join('')}}嗎?
                </p>
              </template>
              <a-button type="danger" ghost
                        v-if="displayDelete"
                        :disabled="deleteBtnDisabled"
              >{{deleteText}}
              </a-button>
            </c-popover>
          </div>
          <div class="col-6 d-flex justify-content-end">
            <a-button
              @click="close"
            >取 消
            </a-button>
            <a-button class="ml-16px" type="primary"
                      @click="ok"
            >確 定
            </a-button>
          </div>

        </div>
      </slot>
    </div>
  </a-drawer>
</template>

<script>
  export default {
    name: "CDrawer",
    props: {
      value: Boolean,
      title: String,
      width: {default: 1360},
      displayDelete: {
        type: Boolean,
        default: false
      },
      deleteText: {
        type: String,
        default: '刪 除 資 料'
      },
      deleteBtnDisabled: {
        type: Boolean,
        default: false
      },
    },
    data() {
      return {
        computed_width: 800
      }
    },
    computed: {},
    watch: {
      value(val) {
        this.$emit('input', val)
      }
    },
    methods: {
      close() {
        this.$emit('input', false)
      },
      ok() {
        this.$emit('ok')
      }
    }
  }
</script>
