<script>
  import store from '@/store'
  import { sendRequest } from '@/utils/helpers'
  import InputText from '@/components/input-text'
  import InputAmount from '@/components/input-amount'
  import InputHidden from '@/components/input-hidden'

  export default {
    template: '#f-fields',
//    render: function (h) {
//      if (this.template) {
//        return this.template()
//      }
//    },
//    created: function () {
//      let el = document.querySelector('#f-fields')
//      this.html = el && el.innerHTML
//      this.template = Vue.compile('<div v-html="html"></div>').render;
//    },
    data () {
      return {
        form: store.state.form
//        html: ''
      }
    },
    methods: {
      onInput: function (v) {
        let self = this
        if (v && this.form.fee) {
          sendRequest('api.checkout.fee', 'get', self.form, String(self.form.amount) + String(self.form.fee)).then(
            function (model) {
              self.form.amount_with_fee = parseInt(model.data.amount_with_fee)
            },
            function (model) {})
        }
      }
    },
    components: {
      InputText,
      InputAmount,
      InputHidden
    }
  }
</script>
