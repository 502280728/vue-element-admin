<template>
  <div class="components-container">
    <!-- <aside><strong>SplitPane</strong> If you've used
      <a href="https://codepen.io/" target="_blank"> codepen</a>,
      <a href="https://jsfiddle.net/" target="_blank"> jsfiddle </a>will not be unfamiliar.
      <a href="https://github.com/PanJiaChen/vue-split-pane" target="_blank"> Github repository</a>
    </aside>-->
    <split-pane split="vertical" @resize="resize">
      <template slot="paneL">
        <split-pane split="horizontal">
          <template slot="paneL">
            <el-form :style="{width:'100%'}">
              <el-form-item label="证书类型">
                <el-select placeholder="选择证书" v-model="zhengshutype">
                  <el-option value="shanghai1" label="证书1"></el-option>
                  <el-option value="shanghai2" label="证书2"></el-option>
                  <el-option value="shanghai3" label="证书3"></el-option>
                  <el-option value="shanghai4" label="证书4"></el-option>
                </el-select>
              </el-form-item>
            </el-form>
            <div class="top-container">
              <h3>签章</h3>
              <div :style="{height:'100%',overflow:'auto'}">
                <span
                  v-for="(image,index) in images"
                  :key="'abc'+index"
                  class="span-pan-thumb-wrapper"
                  @click="clickItem(image)"
                >
                  <pan-thumb :image="image" />
                </span>
                <span class="span-pan-thumb-wrapper">
                  <dropzone
                    id="myVueDropzone"
                    url="https://httpbin.org/post"
                    @dropzone-removedFile="dropzoneR"
                    @dropzone-success="dropzoneS"
                  />
                </span>
              </div>
            </div>
          </template>
          <template slot="paneR">
            <div class="bottom-container">
              <h3>电子签名</h3>
              <div :style="{height:'100%',overflow:'auto'}">
                <span
                  v-for="(image,index) in images2"
                  :key="'abc'+index"
                  class="span-pan-thumb-wrapper"
                >
                  <pan-thumb :image="image" />
                </span>
              </div>
            </div>
          </template>
        </split-pane>
      </template>
      <template slot="paneR">
        <vue-draggable-resizable
          :w="150"
          :h="150"
          :resizable="false"
          :parent="true"
          :x="200"
          :y="200"
        >
          <pan-thumb :image="choosed_image" />
        </vue-draggable-resizable>
        <div class="abc-info" :style="{zIndex:'-100'}">
          <pdf src="abc.pdf" :style="{zIndex:'-100'}" />
        </div>
      </template>
    </split-pane>
  </div>
</template>

<script>
import splitPane from "vue-splitpane";
import PanThumb from "@/components/PanThumb";
import Dropzone from "@/components/Dropzone";
import draggable from "vuedraggable";
import pdf from "vue-pdf";
import VueDraggableResizable from "vue-draggable-resizable";

// optionally import default styles
import "vue-draggable-resizable/dist/VueDraggableResizable.css";
export default {
  name: "SplitpaneDemo",
  components: {
    splitPane,
    PanThumb,
    pdf,
    Dropzone,
    draggable,
    VueDraggableResizable,
  },
  data() {
    return {
      images: [
        "https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=3711535626,1297779669&fm=26&gp=0.jpg",
        "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1599971764293&di=341139d8c7e2c0d520326d06127b9edd&imgtype=0&src=http%3A%2F%2Fwww.0451outs.com%2FUploadFiles%2F2019-4%2F149%2F6369213206636305806083897.jpg",
        "https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=3801084477,3495596200&fm=26&gp=0.jpg",
      ],
      images2:[
"https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1599976727625&di=21d5e2efa60b9a4b8d8d38e93968c463&imgtype=0&src=http%3A%2F%2Fgss0.baidu.com%2F94o3dSag_xI4khGko9WTAnF6hhy%2Fzhidao%2Fpic%2Fitem%2F6a600c338744ebf8627482f2d9f9d72a6159a7f2.jpg",
"https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=1833238331,3319850972&fm=26&gp=0.jpg"
      ],
      choosed_image: "",
      zhengshutype: "",
    };
  },
  methods: {
    resize() {
      console.log("resize");
    },
    dropzoneS(file) {
      console.log(file);
      this.$message({ message: "Upload success", type: "success" });
    },
    dropzoneR(file) {
      this.$message({ message: "Delete success", type: "success" });
    },
    onend(a) {
      console.log(a.oldIndex);
      this.images2 = [this.images1[a.oldIndex]];
    },
    clickItem(image) {
      this.choosed_image = image;
    },
  },
};
</script>

<style  scoped>
.components-container {
  position: relative;
  height: 100vh;
}

.left-container {
  height: 100%;
}

.right-container {
  height: 200px;
}

.top-container {
  width: 100%;
  height: 100%;
}

.bottom-container {
  width: 100%;
  height: 100%;
}
.span-pan-thumb-wrapper {
  display: inline-block;
  padding: 10px;
  width: 200px;
  height: 200px;
  float: left;
}
.ghost {
  display: none !important;
}
#myVueDropzone{
  border-radius: 50%;
  height: 150px !important;
  width: 150px !important;
  padding: 0px !important;
}
</style>
