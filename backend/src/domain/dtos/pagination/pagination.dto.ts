import { z } from 'zod';

export const PaginationDto = z.object({
    page: z.number().int().positive().min(1),
    limit: z.number().int().positive().min(1),
});