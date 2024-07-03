import { error } from "console";
import { config } from "dotenv";
import { z } from "zod";

if(process.env.NODE_ENV === 'test') {
    config({ path: '.env.test' });    
} else {    
    config();
}
config();
const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'test', 'production']).default('production'),
    DATABASE_CLIENT: z.enum(['sqlite3', 'pg']),
    DATABASE_URL: z.string(),
    PORT: z.coerce.number().default(3333),
});

const _env = envSchema.safeParse(process.env);
if (!_env.success) {
    error('⚠️ Invalid Environment Variables', _env.error.format());
    throw new Error('⚠️ Invalid Environment Variables');
}
export const env = _env.data;