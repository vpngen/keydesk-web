import {defineStore} from 'pinia';
import {ref} from 'vue';
import * as proApi from '@/api/pro';

export const useProBillingStore = defineStore('proBilling', () => {
  const status = ref('paid');
  const invoices = ref([]);
  // Текущий неоплаченный инвойс с реального бэкенда (null в мок-режиме).
  const currentInvoice = ref(null);
  const isReal = ref(false);
  const isLoaded = ref(false);
  // Скользящий цикл бригады: пока true - платные ключи списываются сразу;
  // после первого цикла - по инвойсу на nextInvoiceAt.
  const immediateCharges = ref(true);
  const cycleIndex = ref(0);
  const cycleStart = ref(null);
  const cycleEnd = ref(null);
  const nextInvoiceAt = ref(null);
  // Предварительный расчёт следующего инвойса {sum, keys, lines} (null в моке).
  const estimate = ref(null);

  const fetchBilling = async () => {
    const [billing, past] = await Promise.all([
      proApi.fetchProBilling(),
      proApi.fetchProInvoices(),
    ]);
    status.value = billing.status;
    currentInvoice.value = billing.current || null;
    isReal.value = Boolean(billing.real);
    immediateCharges.value = billing.immediateCharges !== false;
    cycleIndex.value = billing.cycleIndex || 0;
    cycleStart.value = billing.cycleStart || null;
    cycleEnd.value = billing.cycleEnd || null;
    nextInvoiceAt.value = billing.nextInvoiceAt || null;
    estimate.value = billing.estimate || null;
    invoices.value = past;
    isLoaded.value = true;
  };

  const payCurrentInvoice = async () => {
    const r = await proApi.payProInvoice();
    status.value = r.status || 'paid';
    if (isReal.value) {
      await fetchBilling();
    }
  };

  return {
    status,
    invoices,
    currentInvoice,
    isReal,
    isLoaded,
    immediateCharges,
    cycleIndex,
    cycleStart,
    cycleEnd,
    nextInvoiceAt,
    estimate,
    fetchBilling,
    payCurrentInvoice,
  };
});
