import api from './api';

/**
 * Product service — wraps all product-related API calls.
 */
const productService = {
  getAll: ()            => api.get('/api/products'),
  getById: (id)         => api.get(`/api/products/${id}`),
  search: (name)        => api.get(`/api/products/search?name=${name}`),
  create: (product)     => api.post('/api/products', product),
  update: (id, product) => api.put(`/api/products/${id}`, product),
  delete: (id)          => api.delete(`/api/products/${id}`),
};

export default productService;
