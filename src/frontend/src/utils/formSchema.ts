"use client";

import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email({
    message: "Invalid email address",
  }),
  password: z
    .string()
    .min(6, {
      message: "Password must be at least 6 characters long",
    })
    .max(100),
});

export const agentSchema = z
  .object({
    name: z.string().min(1, { message: "Name is required" }),
    email: z.string().email({ message: "Invalid email address" }),
    department_id: z.coerce
      .string()
      .min(1, { message: "Department is required" }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters long" }),
    confirmPassword: z
      .string()
      .min(1, { message: "Please confirm your password" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });
export const updateAgentSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  department_id: z.coerce
    .string()
    .min(1, { message: "Department is required" }),
});

export const TicketSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters"
  }).max(100),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters"
  }).max(1000),
  priority: z.enum(["low", "medium", "high"]),
  department_id: z.coerce
    .string()
    .min(1, { message: "Department is required" }),
  attachments: z.any().optional(),
});
