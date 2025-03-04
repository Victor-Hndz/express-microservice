import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { insertRequestSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes
  setupAuth(app);

  // Handle request submission
  app.post("/api/requests", async (req, res) => {
    try {
      const request = insertRequestSchema.parse(req.body);
      const userId = req.isAuthenticated() ? req.user?.id : undefined;

      const createdRequest = await storage.createRequest({
        ...request,
        userId,
      });

      res.status(201).json(createdRequest);
    } catch (error) {
      if (error.name === "ZodError") {
        return res.status(400).json({ message: error.errors[0].message });
      }
      res.status(500).json({ message: "Failed to create request" });
    }
  });

  // Get user's requests (protected route)
  app.get("/api/requests", (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }

    storage.getUserRequests(req.user.id)
      .then(requests => res.json(requests))
      .catch(() => res.status(500).json({ message: "Failed to fetch requests" }));
  });

  const httpServer = createServer(app);
  return httpServer;
}