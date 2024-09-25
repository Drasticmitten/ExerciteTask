import { z } from 'zod';

export const LoginDto = z.object({
    name        : z.string(),
    password    : z.string().min(6),
});
