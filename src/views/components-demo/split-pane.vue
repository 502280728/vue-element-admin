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
            <div class="top-container">
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
        <div :style="{position:'relative',height:'100%',width:'100%'}">
          <div :style="{overflow:'auto',position:'absolute',top:'50%',right:'10%'}">
              <pan-thumb :image="choosed_image" />
          </div>
          <div>
            <pdf src="abc.pdf" />
          </div>
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
export default {
  name: "SplitpaneDemo",
  components: { splitPane, PanThumb, pdf, Dropzone, draggable },
  data() {
    return {
      images: [
        "https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=3711535626,1297779669&fm=26&gp=0.jpg",
        "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1599902255684&di=8b92b245b593974ebd710c4adfc6b0d9&imgtype=0&src=http%3A%2F%2Fa3.att.hudong.com%2F64%2F52%2F01300000407527124482522224765.jpg",
        "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1599902338204&di=7c6c390190e1c43dba1a0d21ae16bf17&imgtype=0&src=http%3A%2F%2Fa3.att.hudong.com%2F65%2F38%2F16300534049378135355388981738.jpg",
      ],
      choosed_image:""
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
    clickItem(image){
      this.choosed_image = image
    }
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
</style>
