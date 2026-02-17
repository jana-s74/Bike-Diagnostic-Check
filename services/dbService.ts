
import { User, HistoryItem, SystemSnapshot, Vehicle, Notification } from '../types';

const USERS_KEY = 'gobuddy_central_users_db';
const LOGS_KEY = 'gobuddy_central_logs_db';
const NOTIFS_KEY = 'gobuddy_central_notifs_db';

class MockDatabase {
  private getStore<T>(key: string): T[] {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  }

  private setStore<T>(key: string, data: T[]): void {
    localStorage.setItem(key, JSON.stringify(data));
  }

  async syncUser(userData: Partial<User>): Promise<User> {
    const users = this.getStore<User>(USERS_KEY);
    const existingIndex = users.findIndex(u => u.id === userData.id);
    
    const now = Date.now();
    const deviceInfo = navigator.userAgent;

    if (existingIndex > -1) {
      const updatedUser = { 
        ...users[existingIndex], 
        ...userData, 
        lastLogin: now,
        deviceInfo 
      };
      users[existingIndex] = updatedUser;
      this.setStore(USERS_KEY, users);
      return updatedUser;
    } else {
      const newUser: User = {
        id: userData.id || `user_${now}`,
        name: userData.name || 'Unknown Rider',
        email: userData.email,
        phone: userData.phone,
        method: userData.method || 'phone',
        createdAt: now,
        lastLogin: now,
        deviceInfo,
        isAdmin: users.length === 0
      };
      users.push(newUser);
      this.setStore(USERS_KEY, users);
      return newUser;
    }
  }

  async updateVehicle(userId: string, vehicle: Vehicle): Promise<User> {
    const users = this.getStore<User>(USERS_KEY);
    const idx = users.findIndex(u => u.id === userId);
    if (idx === -1) throw new Error("User not found");
    
    users[idx].vehicle = vehicle;
    this.setStore(USERS_KEY, users);
    return users[idx];
  }

  async addNotification(userId: string, notif: Omit<Notification, 'id' | 'timestamp' | 'read'>): Promise<void> {
    const notifs = this.getStore<Notification>(NOTIFS_KEY + '_' + userId);
    const newNotif: Notification = {
      ...notif,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      read: false
    };
    notifs.unshift(newNotif);
    this.setStore(NOTIFS_KEY + '_' + userId, notifs.slice(0, 50));
  }

  async getNotifications(userId: string): Promise<Notification[]> {
    return this.getStore<Notification>(NOTIFS_KEY + '_' + userId);
  }

  async markNotifsAsRead(userId: string): Promise<void> {
    const notifs = this.getStore<Notification>(NOTIFS_KEY + '_' + userId);
    notifs.forEach(n => n.read = true);
    this.setStore(NOTIFS_KEY + '_' + userId, notifs);
  }

  async saveDiagnostic(item: HistoryItem): Promise<void> {
    const logs = this.getStore<HistoryItem>(LOGS_KEY);
    logs.push(item);
    this.setStore(LOGS_KEY, logs);
  }

  async getUserHistory(userId: string): Promise<HistoryItem[]> {
    const logs = this.getStore<HistoryItem>(LOGS_KEY);
    return logs.filter(log => log.userId === userId).sort((a, b) => b.timestamp - a.timestamp);
  }

  getSystemSnapshot(): SystemSnapshot {
    const users = this.getStore<User>(USERS_KEY);
    const logs = this.getStore<HistoryItem>(LOGS_KEY);
    const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;

    return {
      totalUsers: users.length,
      totalDiagnostics: logs.length,
      activeUsers24h: users.filter(u => u.lastLogin > oneDayAgo).length
    };
  }
}

export const db = new MockDatabase();
