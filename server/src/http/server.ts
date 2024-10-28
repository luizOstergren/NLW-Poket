import fastify from 'fastify';
import { serializerCompiler, type ZodTypeProvider, validatorCompiler } from 'fastify-type-provider-zod'
import { createGoalRoute } from './routes/create-goal';
import { createGoalcompletionRoutes } from './routes/create-completoin';
import { createPedingsGoalsRoutes } from './routes/get-pedings-goal';
import { getWeekSummaryRoute } from './routes/get-week-summary';
import fastifyCors from '@fastify/cors';

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(fastifyCors, {
    origin: '*'
})

app.register(createPedingsGoalsRoutes);
app.register(createGoalRoute);
app.register(createGoalcompletionRoutes);
app.register(getWeekSummaryRoute);


app.listen({
    port: 3333,
}).then(() => {
    console.log('HTTP is running!')
})