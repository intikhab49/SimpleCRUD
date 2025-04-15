import { users, items, type User, type InsertUser, type Item, type InsertItem, type UpdateItem } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

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

// Database storage implementation
export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Item methods
  async getItems(): Promise<Item[]> {
    return await db.select().from(items);
  }

  async getItem(id: number): Promise<Item | undefined> {
    const [item] = await db.select().from(items).where(eq(items.id, id));
    return item || undefined;
  }

  async createItem(insertItem: InsertItem): Promise<Item> {
    const createdAt = new Date();
    const itemWithDate = { ...insertItem, createdAt };
    const [item] = await db.insert(items).values(itemWithDate).returning();
    return item;
  }

  async updateItem(id: number, updateItem: UpdateItem): Promise<Item | undefined> {
    const [existingItem] = await db.select().from(items).where(eq(items.id, id));
    
    if (!existingItem) {
      return undefined;
    }
    
    const [updatedItem] = await db
      .update(items)
      .set(updateItem)
      .where(eq(items.id, id))
      .returning();
    
    return updatedItem;
  }

  async deleteItem(id: number): Promise<boolean> {
    const [deletedItem] = await db
      .delete(items)
      .where(eq(items.id, id))
      .returning();
    
    return !!deletedItem;
  }
}

export const storage = new DatabaseStorage();
