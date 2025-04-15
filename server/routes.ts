import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertItemSchema, updateItemSchema } from "@shared/schema";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";
import { setupAuth } from "./auth";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes
  setupAuth(app);
  // API routes for items
  
  // Get all items
  app.get('/api/items', async (req: Request, res: Response) => {
    try {
      const items = await storage.getItems();
      res.json(items);
    } catch (error) {
      console.error('Error fetching items:', error);
      res.status(500).json({ message: 'Failed to fetch items' });
    }
  });

  // Get single item
  app.get('/api/items/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid item ID' });
      }
      
      const item = await storage.getItem(id);
      
      if (!item) {
        return res.status(404).json({ message: 'Item not found' });
      }
      
      res.json(item);
    } catch (error) {
      console.error('Error fetching item:', error);
      res.status(500).json({ message: 'Failed to fetch item' });
    }
  });

  // Create item
  app.post('/api/items', async (req: Request, res: Response) => {
    try {
      const validatedData = insertItemSchema.safeParse(req.body);
      
      if (!validatedData.success) {
        const validationError = fromZodError(validatedData.error);
        return res.status(400).json({ message: validationError.message });
      }
      
      const newItem = await storage.createItem(validatedData.data);
      res.status(201).json(newItem);
    } catch (error) {
      console.error('Error creating item:', error);
      res.status(500).json({ message: 'Failed to create item' });
    }
  });

  // Update item
  app.put('/api/items/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid item ID' });
      }
      
      const validatedData = updateItemSchema.safeParse(req.body);
      
      if (!validatedData.success) {
        const validationError = fromZodError(validatedData.error);
        return res.status(400).json({ message: validationError.message });
      }
      
      const updatedItem = await storage.updateItem(id, validatedData.data);
      
      if (!updatedItem) {
        return res.status(404).json({ message: 'Item not found' });
      }
      
      res.json(updatedItem);
    } catch (error) {
      console.error('Error updating item:', error);
      res.status(500).json({ message: 'Failed to update item' });
    }
  });

  // Delete item
  app.delete('/api/items/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid item ID' });
      }
      
      const deleted = await storage.deleteItem(id);
      
      if (!deleted) {
        return res.status(404).json({ message: 'Item not found' });
      }
      
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting item:', error);
      res.status(500).json({ message: 'Failed to delete item' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
