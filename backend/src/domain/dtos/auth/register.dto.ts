import { z } from 'zod';

export const RegisterDto = z.object({
    name                    : z.string(),
    email                   : z.string(),
    password                : z.string().min(6),
    passwordConfirmation    : z.string().min(6),
});