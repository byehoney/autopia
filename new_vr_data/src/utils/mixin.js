import Echarts from 'echarts'
import _ from 'lodash'

export default {
    computed: {
        /* 图表DOM */
        $_chartMixin_chartWrapperDom() {
            const dom = document.getElementById(this.thisDomId)
            return dom && Echarts.init(dom)
        },

        /** 图表resize节流，这里使用了lodash，也可以自己使用setTimout实现节流 */
        $_chartMixin_chartResize() {
            return _.throttle(() => this.$_chartMixin_chartWrapperDom.resize(), 400)
        }
    },

    methods: {
        /* 图表初始化 */
        $_chartMixin_initChart(options) {
            if(!options){return};
            this.$_chartMixin_chartWrapperDom.setOption(options)
        }
    },

    mounted() {
        this.$_chartMixin_initChart()
        window.addEventListener('resize', this.$_chartMixin_chartResize)
    },

    destroyed() {
        window.removeEventListener('resize', this.$_chartMixin_chartResize)
    }
}