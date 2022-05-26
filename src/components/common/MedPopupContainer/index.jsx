import './index.less'
import MedViewContainer from './../MedViewContainer'
import {
  getClass,
  getStyle,
  initDefaultProps,
  getListeners,
  getOptionProps
} from '../../_utils/props-util'
const selfProps = (defaultProps = {}) => {
  return initDefaultProps(
    {
      ...MedViewContainer.props,
      returnLabel: {
        type: String,
        required: false,
        default: '返回'
      },
      show: {
        type: Boolean,
        required: false,
        default: false
      }
    },
    defaultProps
  )
}
export default {
  name: 'MedPopupContainer',
  inheritAttrs: false,
  components: { MedViewContainer },
  props: selfProps({}),
  model: {
    prop: 'show',
    event: '_change'
  },
  methods: {
    close() {
      this.$emit('_change', false)
    },
    onClickLeft() {
      const obj = getListeners(this)
      if (obj && (obj.backClick || obj['return'])) {
        obj.backClick && obj.backClick()
        obj['return'] && obj['return']()
      } else {
        this.close()
      }
    }
  },
  render() {
    const TProps = {
      class: getClass(this),
      style: getStyle(this)
    }
    const ChildProps = {
      attrs: this.$attrs,
      props: {
        ...getOptionProps(this),
        leftText: this.returnLabel
      },
      on: {
        ...getListeners(this),
        backClick: this.onClickLeft
      }
    }
    const bodySlots = Object.keys(this.$slots).map(slot => {
      if (slot === 'default') return this.$slots[slot]
      return <template slot={slot}>{this.$slots[slot]}</template>
    })
    return (
      <van-popup
        class="med-popup-container-wrapper"
        teleport="#app"
        v-model={this.show}
        close-on-click-overlay={false}
        position="right"
        {...TProps}
      >
        <med-view-container {...ChildProps}>{bodySlots}</med-view-container>
      </van-popup>
    )
  }
}
