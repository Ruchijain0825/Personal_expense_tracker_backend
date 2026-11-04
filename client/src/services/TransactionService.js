import api from "./api";

export const createTransaction = async (data) => {
  const response = await api.post("/api/transactions", data);
  return response.data;
};

export const getTransactions = async (params = {}) => {
  const response = await api.get("/api/transactions", { params });
  return response.data;
};

export const getTransactionSummary = async () => {
  const response = await api.get("/api/transactions/summary");
  return response.data;
};

export const updateTransaction = async (id, data) => {
  const response = await api.patch(
    `/api/transactions/${id}`,
    data
  );
  return response.data;
};

export const deleteTransaction = async (id) => {
  const response = await api.delete(`/api/transactions/${id}`);
  return response.data;
};

export const getTransactionById = async (id) => {
  const response = await api.get(`/api/transactions/${id}`);
  return response.data;
};

export const previewAITransaction = async (message) => {
  const response = await api.post("/api/expenses/ai/preview", {
    message,
  });
  return response.data;
};