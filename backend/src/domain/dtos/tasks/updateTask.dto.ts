import moment from 'moment';
import { z } from 'zod';

const dateFormatter = () => moment().format('YYYY-MM-DD HH:mm:ss');

export const UpdateTaskDto = z.object({
    nameUser    : z.string().optional(),
    name        : z.string().optional(),
    updatedAt   : z.string().default(dateFormatter()),
    end         : z.string().optional(),
    description : z.string().optional(),
    status      : z.enum(['todo', 'inprogress', 'done']).optional(),
}).refine((data) => {
    if (data.status === 'done') {
        data.end = dateFormatter();
    }
    return true;
}, {
    message: "End date must be set if status is 'done'",
});