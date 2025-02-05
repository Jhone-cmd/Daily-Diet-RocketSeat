import { Knex } from "knex";

declare module 'knex/types/tables' {
    export interface Tables {
        users: {
            id: string,
            session_id?: string,
            name: string,
            email: string,
            created_at: string,
            updated_at: string
        },        
        meals: {
            id: string,
            name: string,
            description: string,
            diet: boolean,
            created_at: string,
            updated_at: string
        }
    }
}