<template>
  <a-layout-content>
    <div class="l-breadcrumb container-fluid pt-16px pb-120px white-bg">
      <a-breadcrumb class="breadcrumb mb-16px">
        <a-breadcrumb-item :key="1">
          <span>文案管理</span>
        </a-breadcrumb-item>
        <a-breadcrumb-item :key="2">
          <span>買就送活動管理</span>
        </a-breadcrumb-item>
      </a-breadcrumb>
      <h3>買就送活動管理</h3>
    </div>
    <div class="container-fluid pt-24px">
      <a-card class="mb-24px ">
        <div class="d-flex">
          <a-form
            :form="search_form"
            layout="inline"
            @submit="submit"
            class="row fill-width"
          >
            <a-form-item label="快速查詢商品" class="col-6 mr-0px">
              <a-input
                v-decorator="['keywords', { rules: [
            ]}]"
                placeholder="請輸入商品編號、商品名稱"
                style="width: 250px"
              />
            </a-form-item>

            <div class="col-6 d-flex justify-content-end">
              <a-form-item>
                <a-button type="primary" html-type="submit" block>
                  查 詢
                </a-button>
              </a-form-item>
              <a-form-item class="mr-0px">
                <a-button type="" @click="reset">
                  重 置
                </a-button>
              </a-form-item>
            </div>
          </a-form>
        </div>
      </a-card>

      <div class="row">
        <div class="col-3 pb-24px"
             v-if="permissioncheck('permission_banner_manage', 2)"
        >
          <create-card
            @click="create_drawer=true" style="height: 160px" title="新 增 活 動"></create-card>
        </div>
        <div class="col-3 pb-24px" v-for="item in items" :key="item.id">
          <ActivityCard
            :item="item"
            :initCallback="initData"
            @update="openUpdateDrawer(item)"
          />
        </div>
      </div>
    </div>
    <ActivityDrawer
      v-model="create_drawer"
      :initCallback="initData"
    ></ActivityDrawer>

    <ActivityDrawer
      v-model="update_drawer"
      :initCallback="initData"
      :item="target"
    ></ActivityDrawer>
  </a-layout-content>
</template>

<script>
  import CreateCard from "@/components/CreateCard"
  import ActivityCard from "@/components/ActivityCard"
  import {mapState} from 'vuex'
  import pageMixin from "@/mixins/pageMixin"
  import searchFormMixin from "@/mixins/searchFormMixin"
  import ActivityDrawer from "@/components/ActivityDrawer"

  let table_name = 'activity'
  export default {
    mixins: [pageMixin, searchFormMixin],
    components: {
      CreateCard,
      ActivityCard,
      ActivityDrawer
    },
    data() {
      return {
        table_name,
      }
    },
    methods: {},
    computed: {
      ...mapState(table_name, {
        items: state => state.items
      })
    }
  }
</script>
