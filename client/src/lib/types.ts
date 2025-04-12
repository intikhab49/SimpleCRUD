// Item types
export interface Item {
  id: number;
  name: string;
  description?: string;
  createdAt: string | Date;
}

export interface CreateItemInput {
  name: string;
  description?: string;
}

export interface UpdateItemInput {
  name: string;
  description?: string;
}
