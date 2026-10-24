const BASE_URL = '/api';

export const api = {
  // Settings
  async getSettings() {
    const res = await fetch(`${BASE_URL}/settings`);
    return res.json();
  },
  async updateSettings(data) {
    const res = await fetch(`${BASE_URL}/settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  // Products
  async getProducts(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${BASE_URL}/products${query ? `?${query}` : ''}`);
    return res.json();
  },
  async createProduct(data) {
    const res = await fetch(`${BASE_URL}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Erreur lors de la création du produit');
    }
    return res.json();
  },
  async updateProduct(id, data) {
    const res = await fetch(`${BASE_URL}/products/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Erreur lors de la mise à jour du produit');
    }
    return res.json();
  },
  async deleteProduct(id) {
    const res = await fetch(`${BASE_URL}/products/${encodeURIComponent(id)}`, {
      method: 'DELETE'
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Erreur lors de la suppression du produit');
    }
    return res.json();
  },

  // Orders
  async getOrders() {
    const res = await fetch(`${BASE_URL}/orders`);
    return res.json();
  },
  async createOrder(data) {
    const res = await fetch(`${BASE_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },
  async updateOrder(id, data) {
    const res = await fetch(`${BASE_URL}/orders/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },
  async updateOrderStage(id, stage, note = '') {
    const res = await fetch(`${BASE_URL}/orders/${id}/stage`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stage, note })
    });
    return res.json();
  },
  async advanceOrderStage(id, note = '') {
    const res = await fetch(`${BASE_URL}/orders/${id}/advance-stage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ note })
    });
    return res.json();
  },
  async acceptOrder(id, daysRemaining, note = '') {
    const res = await fetch(`${BASE_URL}/orders/${id}/accept`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ daysRemaining, note })
    });
    return res.json();
  },
  async updateOrderTimeline(id, daysRemaining, estimatedCompletionDate) {
    const res = await fetch(`${BASE_URL}/orders/${id}/timeline`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ daysRemaining, estimatedCompletionDate })
    });
    return res.json();
  },
  async trackOrder(query) {
    const res = await fetch(`${BASE_URL}/orders/track/${encodeURIComponent(query)}`);
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Commande introuvable');
    }
    return res.json();
  },
  async deleteOrder(id) {
    const res = await fetch(`${BASE_URL}/orders/${id}`, {
      method: 'DELETE'
    });
    return res.json();
  },

  // Customers
  async getCustomers() {
    const res = await fetch(`${BASE_URL}/customers`);
    return res.json();
  },
  async createCustomer(data) {
    const res = await fetch(`${BASE_URL}/customers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },
  async updateCustomer(id, data) {
    const res = await fetch(`${BASE_URL}/customers/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },
  async deleteCustomer(id) {
    const res = await fetch(`${BASE_URL}/customers/${id}`, {
      method: 'DELETE'
    });
    return res.json();
  },

  // Fabrics & Materials
  async getFabrics() {
    const res = await fetch(`${BASE_URL}/fabrics`);
    return res.json();
  },
  async createFabric(data) {
    const res = await fetch(`${BASE_URL}/fabrics`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },
  async updateFabric(id, data) {
    const res = await fetch(`${BASE_URL}/fabrics/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },
  async adjustFabricStock(id, delta) {
    const res = await fetch(`${BASE_URL}/fabrics/${id}/adjust-stock`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ delta })
    });
    return res.json();
  },
  async deleteFabric(id) {
    const res = await fetch(`${BASE_URL}/fabrics/${id}`, {
      method: 'DELETE'
    });
    return res.json();
  },

  // Stages & Analytics
  async getStages() {
    const res = await fetch(`${BASE_URL}/stages`);
    return res.json();
  },
  async getAnalytics() {
    const res = await fetch(`${BASE_URL}/analytics`);
    return res.json();
  },

  // Web in-app messages
  async getMessages() {
    const res = await fetch(`${BASE_URL}/messages`);
    return res.json();
  },
  async sendMessage(data) {
    const res = await fetch(`${BASE_URL}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },
  async deleteMessage(id) {
    const res = await fetch(`${BASE_URL}/messages/${id}`, {
      method: 'DELETE'
    });
    return res.json();
  },

  // Categories (Recent Added Circular Pods)
  async getCategories() {
    const res = await fetch(`${BASE_URL}/categories`);
    return res.json();
  },
  async updateCategory(id, data) {
    const res = await fetch(`${BASE_URL}/categories/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },
  async createCategory(data) {
    const res = await fetch(`${BASE_URL}/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },
  async deleteCategory(id) {
    const res = await fetch(`${BASE_URL}/categories/${encodeURIComponent(id)}`, {
      method: 'DELETE'
    });
    return res.json();
  },

  // Hero Slides (Homepage customization)
  async getHeroSlides() {
    const res = await fetch(`${BASE_URL}/hero-slides`);
    return res.json();
  },
  async updateHeroSlide(id, data) {
    const res = await fetch(`${BASE_URL}/hero-slides/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },
  async updateHeroSlides(slides) {
    const res = await fetch(`${BASE_URL}/hero-slides`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(slides)
    });
    return res.json();
  },

  // Upload image (Supports File object or base64 dataUrl)
  async uploadImage(fileOrDataUrl) {
    if (typeof fileOrDataUrl === 'string' && fileOrDataUrl.startsWith('data:')) {
      const res = await fetch(`${BASE_URL}/upload`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dataUrl: fileOrDataUrl })
      });
      return res.json();
    }
    const formData = new FormData();
    formData.append('image', fileOrDataUrl);
    const res = await fetch(`${BASE_URL}/upload`, {
      method: 'POST',
      body: formData
    });
    return res.json();
  }
};
