<script setup lang="ts">
import { useAccountStore } from "../stores/account";

const store = useAccountStore();
</script>

<template>
  <div class="accounts">
    <h2 class="accounts__title">Список аккаунтов</h2>
    <ul class="accounts__list">
      <li v-for="(account, index) in store.accounts" :key="index" class="accounts__item">
        <div class="account-card">
          <h3 class="account-card__login">{{ account.login }}</h3>
          <p class="account-card__type">Тип: {{ account.type || "Не указан" }}</p>
          <p class="account-card__password">Пароль: {{ account.password || "Не установлен" }}</p>
          <div v-if="account.mark.length" class="account-card__marks">
            Метки:
            <p v-for="(mark, index) in account.mark" :key="index">
                {{ mark.text }} {{ index + 1 === account.mark.length ? "" : "," }}
            </p>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped lang="scss">
.accounts {
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;

  &__title {
    font-size: 24px;
    margin-bottom: 20px;
    color: #333;
    text-align: center;
  }

  &__list {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  &__item {
    margin-bottom: 15px;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    overflow: hidden;
    transition: box-shadow 0.3s ease;
  }
}

.account-card {
  padding: 16px;
  background: #fff;

  &__login {
    font-size: 18px;
    font-weight: bold;
    margin: 0 0 8px 0;
    color: #2c3e50;
  }

  &__type {
    margin: 4px 0;
    color: #666;
    font-size: 14px;
  }

  &__password {
    margin: 4px 0;
    color: #666;
    font-size: 14px;
  }

  &__marks {
    display: flex;
    gap: 3px;
    margin: 4px 0;
    color: #666;
    font-size: 14px;

    p {
      font-weight: 500;
    }
  }
}
</style>
