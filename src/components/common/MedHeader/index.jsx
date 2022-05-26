import './index.less'
import T from 'vant/es/nav-bar/index'
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
      ...T.props,
      rightText: {
        required: false,
        type: String,
        default: ''
      },
      leftText: {
        required: false,
        type: String,
        default: '返回'
      },
      leftArrow: {
        required: false,
        type: Boolean,
        default: true
      },
      title: {
        required: false,
        type: String,
        default: ''
      },
      isFixed: {
        required: false,
        type: Boolean,
        default: true
      },
      wide: {
        type: Boolean,
        default: false
      }
    },
    defaultProps
  )
}
export default {
  TreeNode: { ...T.TreeNode, name: 'MedHeaderNode' },
  name: 'MedHeader',
  inheritAttrs: false,
  props: selfProps({}),
  methods: {
    onClickLeft() {
      this.$emit('backClick')
    },
    onClickRight() {
      this.$emit('editClick')
    }
  },
  render() {
    const { $attrs, $scopedSlots } = this
    const TProps = {
      class: getClass(this),
      style: getStyle(this)
    }
    const ChildProps = {
      attrs: $attrs,
      props: {
        ...getOptionProps(this)
      },
      on: {
        ...getListeners(this),
        'click-left': this.onClickLeft,
        'click-right': this.onClickRight
      },
      scopedSlots: $scopedSlots
    }
    const bodySlots = Object.keys(this.$slots).map(slot => {
      if (slot === 'default') return this.$slots[slot]
      return <template slot={slot}>{this.$slots[slot]}</template>
    })
    return (
      <div
        class={{
          'med-header-wrapper': true,
          'med-header-wrapper-wide': this.wide,
          'med-header-fixed': this.isFixed
        }}
        {...TProps}
      >
        <van-nav-bar class="med-header-nav-bar" {...ChildProps}>
          {bodySlots}
        </van-nav-bar>
      </div>
    )
  }
}
