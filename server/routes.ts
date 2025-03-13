import type { Express } from "express";
import { createServer, type Server } from "http";
import passport from "passport";
import { insertRequestSchema } from "@shared/schema/schema";
import { setupAuth, isAuthenticated, hashPassword } from "./auth";
import { storage } from "./storage";

/**
 * @typedef {object} UserResponse
 * @property {number} id - User ID
 * @property {string} username - Username
 * @property {string} email - User email
 */

/**
 * @typedef {object} RequestResponse
 * @property {number} id - Request ID
 * @property {string} variableName - Name of the variable
 * @property {string} outDir - Output directory
 * @property {boolean} debug - Debug mode
 * @property {number} [userId] - User ID (if authenticated)
 * @property {Date} createdAt - Creation timestamp
 */

// User domain routes
function setupUserRoutes(app: Express) {
  /**
   * POST /api/register
   * @summary Register a new user
   * @tags Authentication
   * @param {object} request.body.required - User registration info
   * @param {string} request.body.username.required - Username
   * @param {string} request.body.password.required - Password
   * @param {string} request.body.email.required - Email
   * @return {UserResponse} 201 - User created successfully
   * @return {object} 400 - Username already exists
   * @return {object} 500 - Server error
   */
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

  /**
   * POST /api/login
   * @summary Login user
   * @tags Authentication
   * @param {object} request.body.required - Login credentials
   * @param {string} request.body.username.required - Username
   * @param {string} request.body.password.required - Password
   * @return {UserResponse} 200 - Login successful
   * @return {object} 401 - Unauthorized
   */
  app.post("/api/login", passport.authenticate("local"), (req, res) => {
    res.status(200).json(req.user);
  });

  /**
   * POST /api/logout
   * @summary Logout user
   * @tags Authentication
   * @return {object} 200 - Logout successful
   */
  app.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });

  /**
   * GET /api/user
   * @summary Get current user profile
   * @tags User
   * @security BasicAuth
   * @return {UserResponse} 200 - User profile retrieved successfully
   * @return {object} 401 - Unauthorized
   */
  app.get("/api/user", isAuthenticated, (req, res) => {
    res.json(req.user);
  });

  /**
   * PATCH /api/user
   * @summary Update user profile
   * @tags User
   * @security BasicAuth
   * @param {object} request.body - User update data
   * @param {string} [request.body.username] - New username
   * @param {string} [request.body.email] - New email
   * @return {UserResponse} 200 - Profile updated successfully
   * @return {object} 400 - Username already exists
   * @return {object} 401 - Unauthorized
   */
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

  /**
   * DELETE /api/user
   * @summary Delete user account
   * @tags User
   * @security BasicAuth
   * @return {object} 200 - Account deleted successfully
   * @return {object} 401 - Unauthorized
   */
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
  /**
   * POST /api/requests
   * @summary Submit a new geospatial data request
   * @tags Requests
   * @param {object} request.body.required - Request parameters
   * @param {string} request.body.variableName.required - Variable name
   * @param {string} request.body.outDir.required - Output directory
   * @param {boolean} request.body.debug - Debug mode
   * @return {RequestResponse} 201 - Request created successfully
   * @return {object} 400 - Invalid request parameters
   */
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

  /**
   * GET /api/requests
   * @summary Get user's request history
   * @tags Requests
   * @security BasicAuth
   * @return {array<RequestResponse>} 200 - List of requests retrieved successfully
   * @return {object} 401 - Unauthorized
   */
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
  setupAuth(app);
  setupUserRoutes(app);
  setupRequestRoutes(app);

  const httpServer = createServer(app);
  return httpServer;
}