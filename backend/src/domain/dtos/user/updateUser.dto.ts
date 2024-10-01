import { z } from 'zod';

export const UpdateUserDto = z.object({
    name        : z.string().optional(),
    email       : z.string().email().optional(),
    password    : z.string().min(6).optional(),
});