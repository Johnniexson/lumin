<template>
  <div class="app">
    <div class="prod-page">
      <nav class="navbar" role="navigation" aria-label="main navigation">
        <div class="navbar-brand">
          <span class="navbar-item is-size-4 pr-5">
            <h2>L U M I N</h2>
          </span>

          <a role="button" class="navbar-burger burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </a>
        </div>

        <div id="navbarBasicExample" class="navbar-menu">
          <div class="navbar-start">
            <a class="navbar-item">
              Shop
            </a>

            <a class="navbar-item">
              Learn
            </a>
          </div>

          <div class="navbar-end">
            <div class="navbar-item">
              <div class="d-flex has-text-grey-dark">
                <span class="mr-3">
                  <strong>Account</strong>
                </span>
                <div class="has-badge" @click="openCartModal = true">
                  <i class="fas fa-shopping-cart"></i>
                  <div class="badge">{{cart.items.length}}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <main>
        <div class="header d-flex align-items-end justify-content-between">
          <div class="desc">
            <h2 class="is-size-5 mb-4">All Products</h2>
            <small>A 360˚ look of lumin</small>
          </div>
          <div class="filter">
            <div class="dropdown is-hoverable">
              <div class="dropdown-trigger">
                <button class="button" aria-haspopup="true" aria-controls="dropdown-menu4">
                  <span>Filter by</span>
                  <span class="icon is-small">
                    <i class="fas fa-angle-down" aria-hidden="true"></i>
                  </span>
                </button>
              </div>
              <div class="dropdown-menu" id="dropdown-menu4" role="menu">
                <div class="dropdown-content">
                  <div class="dropdown-item">
                    <p>Price</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-if="$apollo.loading" class="loading">
          <div class="loader"></div>
        </div>
        <div v-else class="products">
          <div class="columns is-multiline is-mobile">
            <div class="column is-half-mobile is-one-third-tablet is-one-third-desktop is-one-third-widescreen is-one-third-fullhd item" v-for="(product, idx) in products" :key="idx">
              <img class="pr_img mb-5" :src="product.image_url" alt="image">
              <h2>{{product.title}}</h2>
              <h3 class="price mb-3"><strong>From {{formatCurrency(product.price)}}</strong></h3>
              <button class="button is-primary" @click="add(product)">Add to Cart</button>
            </div>
          </div>
        </div>
      </main>
    </div>

    <div v-if="openCartModal" class="cart-wrapper">
      <cart :cart="cart" :currencies="currencies" :currency="currency" @currencyChange="active_currency = $event" @close="openCartModal = false" @increment="increment($event)" @decrement="decrement($event)" @remove="remove($event)"/>
    </div>
  </div>
</template>

<script>
import Cart from './components/Cart.vue';
import {LUMIN_QUERY} from './constants/graphql.js'

export default {
  name: 'App',
  components: {
    Cart
  },

  data () {
    return {
      // Initialize your apollo data
      active_currency: 'USD',
      data: {
        currency: [],
        products: []
      },
      cart: {
        items: [],
        total: 0
      },
      openCartModal: false,
    }
  },

  computed: {
    currencies() {
      return this.data.currency;
    },
    products() {
      return this.data.products;
    },
    currency() {
      return this.active_currency;
    }
  },

  watch: {
    products: {
      handler() {
        this.reProcessCart();
      },
      deep: true
    },
    "cart.items": {
      handler: function(newVal, oldVal){
        console.log(newVal, oldVal, this.cart, "fire");
        this.cart.total = this.cart.items.reduce((a, c,) => a + (c.price * c.count), 0);
      },
      deep: true
    }
  },

  apollo: {
    data: {
      query: LUMIN_QUERY,
      variables() {
        return {currency: this.currency}
      },
      update: data => data,
    },
  },

  methods: {
    add($item) {
      this.openCartModal = true;
      const item = this.cart.items.find(_item => _item.id === $item.id);
      if(item) {
        this.increment(item);
      } else {
        this.cart.items.push({...$item, count: 1});
        console.log($item, "add");
      }
    },

    increment(item) {
      const idx = this.cart.items.findIndex(_item => _item.id === item.id);
      if(idx > -1) {
        this.cart.items.splice(idx, 1, {...item, count: item.count + 1})
      }
    },

    decrement(item) {
      if((item.count - 1) < 1) {
        this.remove(item);
        return;
      }
      const idx = this.cart.items.findIndex(_item => _item.id === item.id);
      if(idx > -1) {
        this.cart.items.splice(idx, 1, {...item, count: item.count - 1})
      }
    },

    remove(item) {
      const idx = this.cart.items.findIndex(_item => _item.id === item.id);
      if(idx > -1) {
        this.cart.items.splice(idx, 1)
      }
    },

    reProcessCart() {
      this.cart.items = this.cart.items.map(item => {
        const prod = this.products.find(_prod => _prod.id === item.id);
        if (prod) {
          return {
            ...prod,
            count: item.count
          }
        } else {
          return item;
        }
      })
    },

    formatCurrency(value) {
      return new Intl.NumberFormat('en', { style: 'currency', currency: this.currency }).format(value)
    }
  }
}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #4b5648;
  margin-top: 60px;
}
.app {
 position: relative;
 height: 100vh;
 overflow: hidden;
}

.prod-page {
  main {
    height: 100vh;
    overflow: auto;
  }
}

.cart-wrapper {
  position: fixed;
  top: 0;
  z-index: 99;
}

.navbar {
  padding: 10px 50px;
  border-bottom: solid 1px;
}

.header {
  padding: 50px;
  .desc {
    color: #000;
    h2 {
      font-size: 30px;
    }
  }
}
.dropdown-trigger button {
  width: 250px;
  justify-content: space-between;
}
.products {
  background-color: #e2e6e3;
  .item {
    text-align: center;
    margin: 60px 0;
    img {
      height: 200px;
      max-width: 200px;
      object-fit: contain;
    }
  }
}
</style>
