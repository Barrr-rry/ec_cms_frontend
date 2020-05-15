<template>
  <a-layout-content>
    <c-upload
      :multiple="true"
    ></c-upload>
    <a-upload
      action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
      :multiple="true"
      :file-list="fileList"
      @change="handleChange"
    >
      <a-button>
        <a-icon type="upload"/>
        Upload
      </a-button>
    </a-upload>
  </a-layout-content>
</template>
<script>


  export default {
    components: {},
    data() {
      return {
        fileList: [
          {
            uid: '-1',
            name: 'xxx.png',
            status: 'done',
            url: 'http://www.baidu.com/xxx.png',
          },
        ],
      }
    },
    computed: {},

    methods: {
      handleChange(info) {
        let fileList = [...info.fileList];

        // 1. Limit the number of uploaded files
        //    Only to show two recent uploaded files, and old ones will be replaced by the new
        fileList = fileList.slice(-2);

        // 2. read from response and show file link
        fileList = fileList.map(file => {
          if (file.response) {
            // Component will show file.url as link
            file.url = file.response.url;
          }
          return file;
        });

        this.fileList = fileList;
      },
    }
  }
</script>
<style>
</style>


