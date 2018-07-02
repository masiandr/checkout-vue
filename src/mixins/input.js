import Tooltip from '@/components/tooltip'
import {TheMask} from 'vue-the-mask'

export default {
  inject: ['$validator'],
  props: {
    name: {
      type: String,
      required: true
    },
    field: String,
    label: String,
    validate: [String, Object],
    placement: String,
    placeholder: String,
    custom: {
      type: Boolean,
      default: false
    },
    customer_data: {
      type: Boolean,
      default: false
    },
    recurring: {
      type: Boolean,
      default: false
    },
    value: String,
    inputmode: String
  },
  computed: {
    name_() {
      return 'f-' + this.name
    },
    field_() {
      return this.field || this.name
    },
    label_() {
      return this.$t(this.label || this.name)
    },
    placeholder_() {
      return this.$t(this.placeholder)
    },
    hasError() {
      let flag = this.$validator.flags[this.name_]
      return this.errors.has(this.name_) && ((flag && flag.touched) || this.store.state.submit)
    }
  },
  created() {
    if(this.custom) {
      this.form = this.store.state.form.custom
    } else
    if (this.recurring) {
      this.form = this.store.state.form.recurring_data
    } else
    if (this.customer_data) {
      this.form = this.store.state.form.customer_data
    } else
    {
      this.form = this.store.state.form
    }
    if(this.value) {
      this.form[this.field_] = this.value
    }
  },
  methods: {
    onEnter() {
      this.$root.$emit('submit')
    }
  },
  components: {
    Tooltip,
    TheMask
  }
}
