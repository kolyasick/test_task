import { defineStore } from "pinia";
import { ref } from "vue";
import type { AccountForm } from "../types";

export const useAccountStore = defineStore("account", () => {
  const storageAccounts = localStorage.getItem("accounts") ? JSON.parse(localStorage.getItem("accounts")!) : [];
  const accounts = ref<AccountForm[]>(storageAccounts);

  function addAccounts(accs: AccountForm[]) {
    if (!accs.length) return;

    accounts.value = [...accounts.value, ...accs];
  }

  return {
    accounts,
    addAccounts,
  };
});
