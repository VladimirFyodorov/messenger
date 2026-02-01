import { z } from 'zod';

const UserRefSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  firstName: z.string().nullable().optional(),
  lastName: z.string().nullable().optional(),
  avatarUrl: z.string().nullable().optional(),
});

const ChatMemberSchema = z.object({
  id: z.string().uuid(),
  chatId: z.string().uuid(),
  userId: z.string().uuid(),
  role: z.enum(['owner', 'admin', 'member']),
  user: UserRefSchema.nullable().optional(),
});

export const ChatSchema = z.object({
  id: z.string().uuid(),
  name: z.string().nullable(),
  type: z.enum(['direct', 'group']),
  description: z.string().nullable().optional(),
  avatarUrl: z.string().nullable().optional(),
  members: z.array(ChatMemberSchema).optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export const MessageSchema = z.object({
  id: z.string().uuid(),
  chatId: z.string().uuid(),
  senderId: z.string().uuid(),
  content: z.string(),
  status: z.enum(['sent', 'delivered', 'read']).optional(),
  deleted: z.boolean().optional(),
  createdAt: z.string(),
  updatedAt: z.string().optional(),
  sender: UserRefSchema.nullable().optional(),
});

export type Chat = z.infer<typeof ChatSchema>;
export type Message = z.infer<typeof MessageSchema>;
