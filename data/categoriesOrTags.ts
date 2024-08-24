import api from '@/lib/api';

export const fetchItems = async (itemType: string, page: number, pageSize: number, token: string) => {
  try {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    const response = await api.get(`/${itemType}/getAll`, {
      params: { page, pageSize }
    });
    return response.data;
  } catch(error) {
    console.error(error);
    return [];
  }
};

export const addItem = async (itemType: string, data: any, token: string) => {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  const response = await api.post(`/${itemType}/add-item`, data);
  return response.data;
};

export const updateItem = async (itemType: string, id: number, data: any, token: string) => {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  const response = await api.put(`/${itemType}/updateOne/${id}`, data);
  return response.data;
};

export const deleteItem = async (itemType: string, id: number, token: string) => {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  await api.delete(`/${itemType}/deleteOne/${id}`);
};