import { z } from 'zod';
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { createGoalcompletion } from '../../functions/create-goal-completion';

export const createGoalcompletionRoutes: FastifyPluginAsyncZod = async app => {
    app.post('/completions', {
        schema: {
            body: z.object({
                goalId: z.string(),
            })
        }
    }, async request => {
        const { goalId } = request.body
        await createGoalcompletion({
            goalId
        })
    })
}