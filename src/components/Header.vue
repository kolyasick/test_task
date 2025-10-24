<script setup lang="ts">
import Plus from "./icons/Plus.vue";
import Question from "./icons/Question.vue";

defineEmits<{
  (e: "handleAddRow"): void;
}>();
</script>

<template>
  <div class="header">
    <div class="header-container">
      <h1 class="header__title">Учетные записи</h1>
      <button @click="$emit('handleAddRow')" class="header__button">
        <Plus class="header__button-icon" />
      </button>
    </div>

    <div class="header__info">
      <Question class="header__info-icon" />
      <p>Для указания нескольких меток для одной пары логин/пароль используйте разделитель ;</p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.header {
  width: 100%;
  .header-container {
    display: flex;
    align-items: center;
    column-gap: 14px;
  }

  &__button {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    padding: 14px;
    background-color: #fff;
    border: 1px solid gray;
    border-radius: 5px;
    transition: border-color 0.2s;

    &-icon {
      width: 20px;
      aspect-ratio: 1/1;
      color: gray;
      transition: 0.2s;
    }

    &:hover {
      border-color: black;
    }

    &:hover &-icon {
      color: black;
    }
  }

  &__info {
    display: flex;
    align-items: center;
    gap: 15px;
    background-color: rgb(190, 220, 250);
    padding: 2px 4px;
    border-radius: 8px;

    margin-top: 20px;

    &-icon {
      width: 40px;
      aspect-ratio: 1/1;
    }
  }
}
</style>
