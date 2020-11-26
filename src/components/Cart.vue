<template>
  <div class="backdrop" @click.self="$emit('close')">
    <div class="main">
      <div class="header p-0 d-flex align-items-center">
        <div class="clx is-pointer" @click="$emit('close')">
          <i class="fas fa-angle-left"></i>
        </div>
        <div class="text w-100 has-text-centered">
          <h2>YOUR CART</h2>
        </div>
      </div>
      <div class="my-3 currency select is-small">
        <select v-model="_currency">
          <option v-for="(currency, idx) in currencies" :key="idx">{{currency}}</option>
        </select>
      </div>
      <div v-if="cart.items.length < 1" class="empty has-text-centered">Cart is empty.</div>
      <div v-else-if="$apollo.loading" class="loader">
        <div class="loading"></div>
      </div>
      <div v-else class="items">
        <div class="item mb-3" v-for="(item, idx) in cart.items" :key="idx">
          <div class="close is-pointer" @click="$emit('remove', item)">
            <i class="fas fa-times"></i>
          </div>
          <h2 class="ptitle">{{item.title}}</h2>
          <div class="pimg">
              <img :src="item.image_url" alt="pic">
            </div>
          <div class="det mt-4 d-flex">
            <div class="count px-2 d-flex">
              <span class="is-pointer" @click="$emit('decrement', item)">-</span>
              <span class="mx-1">{{item.count}}</span>
              <span class="is-pointer" @click="$emit('increment', item)">+</span>
            </div>
            <div class="price">
              <h2>{{formatCurrency(item.price)}}</h2>
            </div>
          </div>
        </div>
      </div>
      <div class="footer p-0">
        <div class="total d-flex justify-content-between my-3">
          <span><strong class="has-text-primary">Subtotal</strong></span>
          <span><strong class="has-text-primary">{{formatCurrency(cart.total)}}</strong></span>
        </div>
        <button class="button is-primary is-outlined is-fullwidth mb-3">MAKE THIS A SUBSCRIPTION (SAVE 20%)</button>
        <button class="button is-primary is-fullwidth">PROCEED TO CHECKOUT</button>

      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Cart',
  props: {
    currencies: {
      type: Array,
      default: () => []
    },
    currency: {
      type: String,
      default: 'USD'
    },
    cart: {}
  },
  data() {
    return {
      active_currency: ""
    }
  },
  computed: {
    _currency: {
      get() {
        return this.currency;
      },
      set(value) {
        this.active_currency = value;
      }
    }
  },

  watch: {
    active_currency() {
      console.log(this.active_currency, "change");
      this.$emit('currencyChange', this.active_currency);
    }
  },

  methods: {
    formatCurrency(value) {
      return new Intl.NumberFormat('en', { style: 'currency', currency: this.currency }).format(value)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@media(max-width: 450px) {
  .main {
    width: 100vw !important;
  }
}

.backdrop {
  height: 100vh;
  width: 100vw;
  background-color: rgba(1, 7, 14, 0.418);
  position: relative;
}
.main {
  width: 450px;
  padding: 20px;
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  background-color:  #e2e6e3;
}
.clx {
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  border: solid 1px;
  width: 30px;
  height: 30px;
  border-radius: 100%;
}

.items {
  overflow: auto;
  height: calc(100vh - 290px);

  .item .close {
    font-size: 15px;
  }

  .item {
    background-color: #fff;
    padding: 10px 20px;
  }

  .item .ptitle {
    text-overflow: ellipsis;
    width: 90%;
    white-space: nowrap;
    overflow: hidden;
  }

  .item .pimg {
    text-align: end;
    margin: 10px 30px;
    img {
      width: 30px;
      height: 30px;
    }
  }

  .item .det {
    .count {
      border: solid 1px;
      height: 28px;
      margin-right: 7rem;
      * {
        width: 15px;
        height: 15px;
      }
    }
  }
}

.footer {
  position: absolute;
  background: none;
  left: 0;
  right: 0;
  bottom: 10px;
  border-top: solid 1.5px #4b5648;
  margin: 0 20px;
}
</style>
