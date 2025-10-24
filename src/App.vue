<script setup lang="ts">
import { ref, watch } from "vue";
import Trash from "./components/icons/Trash.vue";
import type { AccountForm } from "./types";
import { useAccountStore } from "./stores/account";
import Header from "./components/Header.vue";
import AccountList from "./components/AccountList.vue";
import Eye from "./components/icons/Eye.vue";
import ClosedEye from "./components/icons/ClosedEye.vue";

type Row = AccountForm & { errors: Record<keyof AccountForm, string | null> };

const store = useAccountStore();
const types = ref(["LDAP", "Локальная"]);

const showPassword = ref<boolean[]>([]);

const rows = ref<Row[]>([]);

const handleAddRow = () => {
  rows.value.push({
    errors: {
      login: null,
      mark: null,
      password: null,
      type: null,
    },
    login: "",
    mark: [],
    password: "",
    type: "Локальная",
  });
  showPassword.value.push(false);
};

const handleDeleteRow = (index: number) => {
  rows.value.splice(index, 1);
  showPassword.value.splice(index, 1);
};

const togglePasswordVisibility = (index: number) => {
  showPassword.value[index] = !showPassword.value[index];
};

const onMarkInput = (event: Event, row: AccountForm) => {
  const target = event.target as HTMLInputElement;
  const regexp = /[^A-Za-zА-Яа-яёЁ;\s]/g;

  let newValue = target.value.replace(regexp, "");

  if (newValue.length > 50) {
    newValue = newValue.substring(0, 50);
  }

  target.value = newValue;
  const marks = target.value.split(";");
  row.mark = marks.map((m) => {
    return {
      text: m,
    };
  });
};

const validateField = (field: keyof AccountForm, value: string, rowId: number) => {
  const row = rows.value[rowId];
  if (!row) return;

  if (!value.trim()) {
    row.errors[field as keyof AccountForm] = "Поле обязательно для заполнения";
  } else {
    row.errors[field as keyof AccountForm] = null;
  }
};

const validateInputLength = (event: Event, maxLength: number) => {
  const target = event.target as HTMLInputElement;
  target.value = target.value.substring(0, maxLength);
};

const onTypeChange = (type: string | null, rowId: number) => {
  const row = rows.value[rowId];
  if (!row) return;

  if (!type) {
    row.errors.type = "Поле обязательно для заполнения";
  } else {
    row.errors.type = null;
  }
};

const handleSubmit = () => {
  if (rows.value.some((r) => !r.login || (r.type !== "LDAP" && !r.password))) {
    alert("Заполните все обязательные поля");
    return;
  }

  rows.value = rows.value.map((r) => {
    return {
      ...r,
      password: r.type === "LDAP" ? null : r.password,
    };
  });

  store.addAccounts(rows.value);
  rows.value = [];
};

watch(
  () => store.accounts,
  () => {
    localStorage.setItem("accounts", JSON.stringify(store.accounts));
  }
);
</script>

<template>
  <div class="wrapper">
    <Header @handle-add-row="handleAddRow" />

    <form v-if="rows.length" @submit.prevent="handleSubmit" class="form">
      <div class="form-row__grid">
        <span class="input-title">Метки</span>
        <span class="input-title">Тип записи</span>
        <span class="input-title">Логин</span>
        <span class="input-title">Пароль</span>
      </div>

      <div v-for="(row, index) in rows" :key="index" class="form-row">
        <div class="form-row__grid">
          <label class="input-wrapper" :class="{ error: row.errors.mark }">
            <input @input="onMarkInput($event, row)" type="text" />
            <p v-if="row.errors.mark" class="error-text">{{ row.errors.mark }}</p>
          </label>

          <label class="input-wrapper" :class="{ error: row.errors.type }">
            <select @change="onTypeChange(row.type, index)" v-model="row.type">
              <option :value="null">Выберите тип</option>
              <option v-for="type in types" :key="type" :value="type">{{ type }}</option>
            </select>
            <p v-if="row.errors.type" class="error-text">{{ row.errors.type }}</p>
          </label>

          <label class="input-wrapper" :class="{ error: row.errors.login, expanded: row.type === 'LDAP' }">
            <input
              @blur="validateField('login', row.login, index)"
              @input="validateInputLength($event, 100)"
              maxlength="100"
              v-model.lazy="row.login"
              required
              type="text"
            />
            <p v-if="row.errors.login" class="error-text">{{ row.errors.login }}</p>
          </label>

          <label v-if="row.type !== 'LDAP'" class="input-wrapper password-wrapper" :class="{ error: row.errors.password }">
            <div class="password-input-container">
              <input
                @blur="validateField('password', row.password!, index)"
                @input="validateInputLength($event, 100)"
                maxlength="100"
                v-model.lazy="row.password"
                :type="showPassword[index] ? 'text' : 'password'"
                required
                class="password-input"
              />
              <button type="button" @click="togglePasswordVisibility(index)" class="password-toggle" tabindex="-1">
                <ClosedEye v-if="showPassword[index]" class="eye-icon" />
                <Eye v-else class="eye-icon" />
              </button>
            </div>
            <p v-if="row.errors.password" class="error-text">{{ row.errors.password }}</p>
          </label>
        </div>
        <button type="button" @click="handleDeleteRow(index)" class="form-row__button">
          <Trash class="form-row__button-icon" />
        </button>
      </div>

      <button v-if="rows.length" class="submit-btn" type="submit">Сохранить</button>
    </form>

    <AccountList v-if="store.accounts.length" />
  </div>
</template>

<style scoped lang="scss">
.wrapper {
  max-width: 800px;
  width: 100%;
  margin: 0 auto;
}

.form {
  margin-top: 50px;
  display: flex;
  flex-direction: column;
  gap: 10px;

  &-row {
    display: flex;
    gap: 12px;
    align-items: end;
    position: relative;

    &__grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      align-items: stretch;
      column-gap: 8px;
    }

    &__button {
      display: flex;
      justify-content: center;
      align-items: center;
      background: none;
      border: none;
      cursor: pointer;
      position: absolute;
      right: -35px;
      top: 6px;

      &-icon {
        width: 24px;
        aspect-ratio: 1/1;
      }

      &:hover {
        opacity: 0.7;
      }
    }
  }

  .input-wrapper {
    &.expanded {
      grid-column: span 2 / span 2;
    }

    .input-title {
      display: block;
      margin-bottom: 12px;
      font-weight: 500;
    }

    input,
    select {
      border-radius: 5px;
      border: 1px solid #d1d5db;
      width: 100%;
      padding: 8px 12px;
      font-size: 14px;
      transition: border-color 0.2s ease;

      &:focus {
        outline: none;
        border-color: #3b82f6;
      }
    }

    &.error input {
      border-color: #ef4444;
    }
    &.error select {
      border-color: #ef4444;
    }

    .error-text {
      color: #ef4444;
      font-size: 12px;
      margin-top: 4px;
      min-height: 16px;
      line-height: 100%;
    }

    &.password-wrapper {
      .password-input-container {
        position: relative;
        display: flex;
        align-items: center;
      }

      .password-input {
        padding-right: 40px;
      }

      .password-toggle {
        position: absolute;
        right: 8px;
        background: none;
        border: none;
        cursor: pointer;
        padding: 4px;
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: center;

        &:hover {
          background-color: #f3f4f6;
        }

        .eye-icon {
          width: 18px;
          height: 18px;
          color: #6b7280;
          transition: color 0.2s ease;
        }
      }
    }
  }

  .submit-btn {
    margin-top: 20px;
    padding: 10px 20px;
    background-color: #3b82f6;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.2s ease;

    &:hover {
      background-color: #2563eb;
    }
  }
}
</style>
