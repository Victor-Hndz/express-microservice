import {
  users,
  requests,
  type User,
  type InsertUser,
  type Request,
  type InsertRequest,
} from "@shared/schema";
import { eq, desc } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { db, pool } from "./db";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<InsertUser>): Promise<User>;
  deleteUser(id: number): Promise<void>;
  createRequest(request: InsertRequest & { userId?: number }): Promise<Request>;
  getUserRequests(userId: number): Promise<Request[]>;
  sessionStore: session.Store;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({
      pool,
      createTableIfMissing: true,
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUser(id: number, updateData: Partial<InsertUser>): Promise<User> {
    const [user] = await db.update(users).set(updateData).where(eq(users.id, id)).returning();
    return user;
  }

  async deleteUser(id: number): Promise<void> {
    await db.delete(users).where(eq(users.id, id));
  }

  async createRequest(request: InsertRequest & { userId?: number }): Promise<Request> {
    const [createdRequest] = await db
      .insert(requests)
      .values({
        ...request,
        userId: request.userId,
        createdAt: new Date(),
      })
      .returning();
    return createdRequest;
  }

  async getUserRequests(userId: number): Promise<Request[]> {
    // Get all requests and order by creation date
    const allRequests = await db
      .select()
      .from(requests)
      .where(eq(requests.userId, userId))
      .orderBy(desc(requests.createdAt));

    // Filter out duplicate requests (same variable, outDir, and debug settings)
    const uniqueRequests = allRequests.reduce((acc: Request[], current: Request) => {
      const isDuplicate = acc.some(request => 
        request.variable === current.variable &&
        request.outDir === current.outDir &&
        request.debug === current.debug
      );

      if (!isDuplicate) {
        acc.push(current);
      }
      return acc;
    }, []);

    return uniqueRequests;
  }
}

export const storage = new DatabaseStorage();