import type { Express } from "express";
import { createServer, type Server } from "http";
import passport from "passport";
import { insertRequestSchema } from "@shared/schema/schema";
import { setupAuth, isAuthenticated, hashPassword } from "./auth";
import { storage } from "./storage";

// User domain routes
function setupUserRoutes(app: Express) {
  // Registration endpoint
  app.post("/api/register", async (req, res, next) => {
    try {
      const existingUser = await storage.getUserByUsername(req.body.username);
      if (existingUser) {
        return res.status(400).send("Username already exists");
      }

      const user = await storage.createUser({
        ...req.body,
        password: await hashPassword(req.body.password),
      });

      req.login(user, (err) => {
        if (err) return next(err);
        res.status(201).json(user);
      });
    } catch (err) {
      next(err);
    }
  });

  // Login endpoint
  app.post("/api/login", passport.authenticate("local"), (req, res) => {
    res.status(200).json(req.user);
  });

  // Logout endpoint
  app.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });

  // User profile endpoints
  app.get("/api/user", isAuthenticated, (req, res) => {
    res.json(req.user);
  });

  app.patch("/api/user", isAuthenticated, async (req, res) => {
    const existingUser = await storage.getUserByUsername(req.body.username);
    if (existingUser && existingUser.id !== req.user?.id) {
      return res.status(400).send("Username already exists");
    }

    if (!req.user?.id) {
      return res.status(400).json({ message: "User ID is required" });
    }
    const updatedUser = await storage.updateUser(req.user.id, req.body);
    req.logIn(updatedUser, (err) => {
      if (err) return res.status(500).json({ message: err.message });
      res.json(updatedUser);
    });
  });

  app.delete("/api/user", isAuthenticated, async (req, res) => {
    if (!req.user?.id) {
      return res.status(400).json({ message: "User ID is required" });
    }
    await storage.deleteUser(req.user?.id);
    req.logout((err) => {
      if (err) return res.status(500).json({ message: err.message });
      res.sendStatus(200);
    });
  });
}

// Request domain routes
function setupRequestRoutes(app: Express) {
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
      if (error instanceof Error && error.name === "ZodError") {
        return res.status(400).json({ message: (error as any).errors[0].message });
      }
      res.status(500).json({ message: "Failed to create request" });
    }
  });

  // Get user's requests (protected route)
  app.get("/api/requests", isAuthenticated, (req, res) => {
    if (!req.user?.id) {
      return res.status(400).json({ message: "User ID is required" });
    }
    storage
      .getUserRequests(req.user.id)
      .then((requests) => res.json(requests))
      .catch(() => res.status(500).json({ message: "Failed to fetch requests" }));
  });
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication infrastructure
  setupAuth(app);

  // Configure domain-specific routes
  setupUserRoutes(app);
  setupRequestRoutes(app);

  const httpServer = createServer(app);
  return httpServer;
}
