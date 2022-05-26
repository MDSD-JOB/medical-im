import MedIcon from '@/components/common/MedIcon'
import MedHeader from '@/components/common/MedHeader'
import MedViewContainer from '@/components/common/MedViewContainer'
import MedPopupContainer from '@/components/common/MedPopupContainer'

export default {
  install: Vue => {
    Vue.component('med-icon', MedIcon)
    Vue.component('med-header', MedHeader)
    Vue.component('med-view-container', MedViewContainer)
    Vue.component('med-popup-container', MedPopupContainer)
  }
}
