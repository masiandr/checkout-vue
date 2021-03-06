<template>
  <div class="f-card">
    <div class="f-block f-block-hr f-text-center">
      <img class="f-card-icon" v-for="icon in icons" :src="imagePath(icon)">
    </div>
    <div class="f-block">
      <div class="f-block-sm">
        <input-text name="card_number" label="card_number" field="card_number" :validate="validCardNumber" type="tel" inputmode="numeric" :mask="maskCardNumber" :tokens="tokenCardNumber" :masked="false" :maxlength="23" :group="!!cardsLen" placeholder="card_number_p">
          <span v-if="!cardsLen" :class="[css.fcf, 'f-icon', 'f-i-card-empty']"></span>
          <dropdown slot="group" :class="[css.igb]">
            <button type="button" :class="[css.btn, css.bd, 'f-dropdown-toggle']"><span class="f-caret"></span></button>
            <template slot="dropdown">
              <li v-for="card in state.cards" :class="{active: hasActive(card)}">
                <a role="button" @click="setCardNumber(card)">{{ card.card_number }}</a>
              </li>

            </template>
          </dropdown>
        </input-text>
        <div class="f-row">
          <div class="f-col-xs-7">
            <input-text name="expiry_date" :validate="validExpiryDate" type="tel" inputmode="numeric" :mask="maskExpiryDate" :masked="true" placeholder="expiry_date_p" placement="top"></input-text>
          </div>
          <div class="f-col-xs-5">
            <input-text name="cvv2" :validate="validCvv" type="tel" inputmode="numeric" :mask="maskCvv" :maxlength="digitsCvv" placeholder="cvv2_p">
              <span :class="[css.fcf, 'f-icon',  'f-i-question']"></span>
              <tooltip :text="$t('cvv2_question', [digitsCvv])" trigger="hover" theme="default" target=".f-i-question"></tooltip>
            </input-text>
          </div>
        </div>
        <input-text v-if="options.email" name="checkout-email" field="email" label="email" validate="required|email" placeholder="email_p"></input-text>
        <customer-fields v-if="options.customerFields.length"></customer-fields>
      </div>
    </div>
  </div>
</template>

<script>
//  ['#### ### ### ###', ' #### ###### #####', '#### #### #### ####', '  ######## ##########']
  import store from '@/store'
  import { sendRequest } from '@/utils/helpers'
  import Tooltip from '@/components/tooltip'
  import Dropdown from '@/components/dropdown'
  import InputText from '@/components/input-text'
  import customerFields from '@/components/customer-fields'

  export default {
    inject: ['$validator'],
    props: ['icons'],
    data () {
      return {
        store: store,
        state: store.state,
        form: store.state.form,
        options: store.state.options,
        css: store.state.css,
        maskExpiryDate: '##/##',
        maskCardNumber: 'XXXX XXXX XXXX XXXX XXX',
        maskCvv: '####',
        tokenCardNumber: {
          X: {
            pattern: /[\dX]/
          }
        }
      }
    },
    computed: {
      validExpiryDate: function () {
        let date = new Date()
        let year = String(date.getFullYear()).slice(-2)
        let month = ('0' + (date.getMonth() + 1)).slice(-2)
        return 'required|date_format:MM/YY|after:' + month + '/' + year + ',true'
      },
      validCardNumber: function () {
        return {
          rules: {
            required: true,
            credit_card: !/\d{6}X/.test(this.form.card_number)
          }
        }
      },
      validCvv: function () {
        return 'required|digits:' + this.digitsCvv
      },
      digitsCvv: function () {
        return this.form.card_number.match('^3(?:2|3|4|7)') ? 4 : 3
      },
      cardsLen: function () {
        return this.state.cards.length
      }
    },
    watch: {
      'form.card_number': function (newVal, oldVal) {
        newVal = newVal.replace(/ /g, '')
        oldVal = oldVal.replace(/ /g, '')
        let newFirst = newVal && newVal[0]
        let oldFirst = oldVal && oldVal[0]
        let newBin = newVal && newVal.slice(0, 6)
        let oldBin = oldVal && oldVal.slice(0, 6)
        if (newFirst && newFirst !== oldFirst) {
          sendRequest('api.checkout.card_type_fee', 'get', { first_card_digit: newFirst }, String(newFirst)).then(
            function (model) {},
            function (model) {})
        }
        if (newBin.length === 6 && newBin !== oldBin) {
          sendRequest('api.checkout.card_bin', 'get', { card_bin: newBin }, String(newBin)).then(
            function (model) {},
            function (model) {})
        }
      }
    },
    methods: {
      imagePath: function (id) {
        return require('../assets/img/' + id + '.svg')
      },
      hasActive: function (card) {
        return card.card_number.replace(/ /g, '') === this.form.card_number
      },
      setCardNumber: function (card) {
        store.setCardNumber(card)
        this.$nextTick(function () {
          this.$validator.validateAll()
        })
      }
    },
    components: {
      Tooltip,
      Dropdown,
      InputText,
      customerFields
    }
  }
</script>
