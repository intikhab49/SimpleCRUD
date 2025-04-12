import { users, items, type User, type InsertUser, type Item, type InsertItem, type UpdateItem } from "@shared/schema";

// Storage interface
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Item operations
  getItems(): Promise<Item[]>;
  getItem(id: number): Promise<Item | undefined>;
  createItem(item: InsertItem): Promise<Item>;
  updateItem(id: number, item: UpdateItem): Promise<Item | undefined>;
  deleteItem(id: number): Promise<boolean>;
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private items: Map<number, Item>;
  private userCurrentId: number;
  private itemCurrentId: number;

  constructor() {
    this.users = new Map();
    this.items = new Map();
    this.userCurrentId = 1;
    this.itemCurrentId = 1;
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Item methods
  async getItems(): Promise<Item[]> {
    return Array.from(this.items.values());
  }

  async getItem(id: number): Promise<Item | undefined> {
    return this.items.get(id);
  }

  async createItem(insertItem: InsertItem): Promise<Item> {
    const id = this.itemCurrentId++;
    const createdAt = new Date();
    const item: Item = { ...insertItem, id, createdAt };
    this.items.set(id, item);
    return item;
  }

  async updateItem(id: number, updateItem: UpdateItem): Promise<Item | undefined> {
    const existingItem = this.items.get(id);
    
    if (!existingItem) {
      return undefined;
    }
    
    const updatedItem: Item = { 
      ...existingItem,
      name: updateItem.name,
      description: updateItem.description
    };
    
    this.items.set(id, updatedItem);
    return updatedItem;
  }

  async deleteItem(id: number): Promise<boolean> {
    return this.items.delete(id);
  }
}

export const storage = new MemStorage();
