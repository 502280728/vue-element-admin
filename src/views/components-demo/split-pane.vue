<template>
  <div class="components-container">
    <!-- <aside><strong>SplitPane</strong> If you've used
      <a href="https://codepen.io/" target="_blank"> codepen</a>,
      <a href="https://jsfiddle.net/" target="_blank"> jsfiddle </a>will not be unfamiliar.
      <a href="https://github.com/PanJiaChen/vue-split-pane" target="_blank"> Github repository</a>
    </aside> -->
    <split-pane split="vertical" @resize="resize">
      <template slot="paneL">
        <split-pane split="horizontal">
          <template slot="paneL">
            <div class="top-container">
              <div :style="{height:'100%',overflow:'auto'}">
                <span v-for="(image,index) in images" :key="'abc'+index" class="span-pan-thumb-wrapper">
                  <pan-thumb :image="image" />
                </span>
              </div>
            </div>
          </template>
          <template slot="paneR">
            <div class="bottom-container">

              <div :style="{height:'100%',overflow:'auto'}">
                <span v-for="(image,index) in images" :key="'abc'+index" class="span-pan-thumb-wrapper">
                  <pan-thumb :image="image" />
                </span>
              </div>
            </div>
          </template>
        </split-pane>
      </template>
      <template slot="paneR">
        <div>
          <pdf src="abc.pdf" />
        </div>
      </template>
    </split-pane>
  </div>
</template>

<script>
import splitPane from 'vue-splitpane'
import ImageCropper from '@/components/ImageCropper'
import PanThumb from '@/components/PanThumb'
import pdf from 'vue-pdf'
export default {
  name: 'SplitpaneDemo',
  components: { splitPane, PanThumb, pdf },
  data() {
    return {
      images: ['https://wpimg.wallstcn.com/577965b9-bb9e-4e02-9f0c-095b41417191',
        'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=3711535626,1297779669&fm=26&gp=0.jpg',
        'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=3711535626,1297779669&fm=26&gp=0.jpg',
        'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=3711535626,1297779669&fm=26&gp=0.jpg',
        'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=3711535626,1297779669&fm=26&gp=0.jpg',
        'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=3711535626,1297779669&fm=26&gp=0.jpg',
        'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=3711535626,1297779669&fm=26&gp=0.jpg',
        'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=3711535626,1297779669&fm=26&gp=0.jpg',
        'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=3711535626,1297779669&fm=26&gp=0.jpg',
        'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=3711535626,1297779669&fm=26&gp=0.jpg',
        'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=3711535626,1297779669&fm=26&gp=0.jpg'
      ]
    }
  },
  methods: {
    resize() {
      console.log('resize')
    }
  }
}
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
}
</style>
