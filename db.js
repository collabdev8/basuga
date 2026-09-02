// Database Manager - ใช้ localStorage ในการเก็บข้อมูล
class ChatDatabase {
  constructor() {
    this.storageKey = 'chatRoom98DB';
    this.initDatabase();
  }

  initDatabase() {
    if (!localStorage.getItem(this.storageKey)) {
      const defaultData = {
        users: [
          { id: 'admin', name: 'Admin', password: 'admin123', isAdmin: true, avatar: '👨‍💼', status: 'ออนไลน์', bio: 'ผู้ดูแลระบบ' },
          { id: 'user1', name: 'User 1', password: 'user123', isAdmin: false, avatar: '😀', status: 'ออนไลน์', bio: '' },
          { id: 'Oy0', name: 'Oy0', password: 'adminOy0', isAdmin: true, avatar: '🤖', status: 'ออนไลน์', bio: 'Admin of this server' }
        ],
        messages: [],
        menuLinks: [
          { title: '🏠 Home', url: 'https://example.com', type: 'url' },
          { title: '📁 Documents', url: 'https://example.com/docs', type: 'url' },
          { title: '📞 Contact', url: 'https://example.com/contact', type: 'url' }
        ],
        settings: {
          theme: 'light',
          soundEnabled: true,
          lastUpdated: new Date().toISOString()
        }
      };
      this.saveData(defaultData);
    }
  }

  getData() {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : null;
  }

  saveData(data) {
    data.settings = {
      ...data.settings,
      lastUpdated: new Date().toISOString()
    };
    localStorage.setItem(this.storageKey, JSON.stringify(data));
  }

  // User methods
  getUsers() {
    return this.getData().users;
  }

  getUserById(id) {
    const users = this.getUsers();
    return users.find(u => u.id === id);
  }

  verifyUser(id, password) {
    const user = this.getUserById(id);
    return user && user.password === password ? user : null;
  }

  addUser(userData) {
    const data = this.getData();
    if (data.users.find(u => u.id === userData.id)) {
      return false;
    }
    userData.id = userData.id || `user_${Date.now()}`;
    data.users.push({
      isAdmin: false,
      avatar: '😀',
      status: 'ออนไลน์',
      bio: '',
      ...userData
    });
    this.saveData(data);
    return true;
  }

  updateUser(id, updates) {
    const data = this.getData();
    const index = data.users.findIndex(u => u.id === id);
    if (index !== -1) {
      data.users[index] = { ...data.users[index], ...updates };
      this.saveData(data);
      return data.users[index];
    }
    return null;
  }

  deleteUser(id) {
    const data = this.getData();
    const index = data.users.findIndex(u => u.id === id);
    if (index !== -1) {
      data.users.splice(index, 1);
      this.saveData(data);
      return true;
    }
    return false;
  }

  // Message methods
  getMessages() {
    return this.getData().messages;
  }

  addMessage(message) {
    const data = this.getData();
    message.id = message.id || `msg_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    message.timestamp = message.timestamp || new Date().toISOString();
    data.messages.push(message);
    this.saveData(data);
    return message;
  }

  getMessageById(id) {
    const messages = this.getMessages();
    return messages.find(m => m.id === id);
  }

  deleteMessage(id) {
    const data = this.getData();
    const index = data.messages.findIndex(m => m.id === id);
    if (index !== -1) {
      data.messages.splice(index, 1);
      this.saveData(data);
      return true;
    }
    return false;
  }

  clearMessages() {
    const data = this.getData();
    data.messages = [];
    this.saveData(data);
  }

  // Menu links methods
  getMenuLinks() {
    return this.getData().menuLinks;
  }

  addMenuLink(link) {
    const data = this.getData();
    link.id = link.id || `menu_${Date.now()}`;
    data.menuLinks.push(link);
    this.saveData(data);
    return link;
  }

  updateMenuLink(id, updates) {
    const data = this.getData();
    const index = data.menuLinks.findIndex(m => m.id === id);
    if (index !== -1) {
      data.menuLinks[index] = { ...data.menuLinks[index], ...updates };
      this.saveData(data);
      return data.menuLinks[index];
    }
    return null;
  }

  deleteMenuLink(id) {
    const data = this.getData();
    const index = data.menuLinks.findIndex(m => m.id === id);
    if (index !== -1) {
      data.menuLinks.splice(index, 1);
      this.saveData(data);
      return true;
    }
    return false;
  }

  // Settings methods
  getSettings() {
    return this.getData().settings;
  }

  updateSettings(updates) {
    const data = this.getData();
    data.settings = { ...data.settings, ...updates };
    this.saveData(data);
    return data.settings;
  }

  // Utility methods
  getStats() {
    const data = this.getData();
    return {
      totalUsers: data.users.length,
      totalMessages: data.messages.length,
      totalMenuLinks: data.menuLinks.length,
      onlineUsers: data.users.filter(u => u.status === 'ออนไลน์').length,
      lastUpdated: data.settings.lastUpdated
    };
  }

  resetDatabase() {
    localStorage.removeItem(this.storageKey);
    this.initDatabase();
    return true;
  }
}

// Export instance
const db = new ChatDatabase();
