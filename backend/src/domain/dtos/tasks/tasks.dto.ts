import moment from 'moment';
import { z } from 'zod';

const dateFormatter = () => moment().format('YYYY-MM-DD HH:mm:ss');


export const TaskDto = z.object({
    nameUser    : z.string(),
    name        : z.string(),
    start       : z.string().default(dateFormatter()),
    update      : z.string().optional(),
    end         : z.string().optional(),
    description : z.string(),
    status      : z.enum(['todo', 'inprogress', 'done']),
}).refine((data) => {
    if (data.status === 'done') {
        data.end = dateFormatter();
    }
    return true;
}, {
    message: "End date must be set if status is 'done'",
});