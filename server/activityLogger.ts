import { storage } from "./storage";
import { Request } from "express";

export interface ActivityLogData {
  userId: number;
  action: string;
  resource: string;
  resourceId?: number;
  details?: string;
  ipAddress?: string;
  userAgent?: string;
}

export class ActivityLogger {
  static async log(data: ActivityLogData) {
    try {
      await storage.createActivityLog({
        userId: data.userId,
        action: data.action,
        resource: data.resource,
        resourceId: data.resourceId,
        details: data.details,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
      });
    } catch (error) {
      console.error("Failed to log activity:", error);
    }
  }

  static async logLogin(userId: number, req: Request) {
    await this.log({
      userId,
      action: "login",
      resource: "auth",
      details: "User logged in",
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.get("User-Agent"),
    });
  }

  static async logLogout(userId: number, req: Request) {
    await this.log({
      userId,
      action: "logout",
      resource: "auth",
      details: "User logged out",
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.get("User-Agent"),
    });
  }

  static async logUserRoleChange(adminId: number, targetUserId: number, newRole: string, req: Request) {
    await this.log({
      userId: adminId,
      action: "update_role",
      resource: "user",
      resourceId: targetUserId,
      details: `Changed user role to ${newRole}`,
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.get("User-Agent"),
    });
  }

  static async logUserStatusChange(adminId: number, targetUserId: number, isActive: boolean, req: Request) {
    await this.log({
      userId: adminId,
      action: "update_status",
      resource: "user",
      resourceId: targetUserId,
      details: `${isActive ? "Activated" : "Deactivated"} user account`,
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.get("User-Agent"),
    });
  }

  static async logUserCreation(adminId: number, newUserId: number, req: Request) {
    await this.log({
      userId: adminId,
      action: "create",
      resource: "user",
      resourceId: newUserId,
      details: "Created new user account",
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.get("User-Agent"),
    });
  }

  static async logTransaction(userId: number, action: string, resource: string, resourceId: number, details: string, req: Request) {
    await this.log({
      userId,
      action,
      resource,
      resourceId,
      details,
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.get("User-Agent"),
    });
  }
}