import { and, count, eq, gte, lte, sql } from "drizzle-orm"
import { db } from "../db"
import { goals, goalsCompletions } from "../db/schema"
import dayjs from "dayjs"

interface CreateGoalCompletionRequest {
    goalId: string
}

export async function createGoalcompletion({ goalId }: CreateGoalCompletionRequest) {

    const firstDayOfWeek = dayjs().startOf('week').toDate()
    const lastDayOfWeek = dayjs().endOf('week').toDate()

    const goalsCompletionCount = db.$with('goals_completion_count').as(
        db.select({
            goalId: goalsCompletions.goalId,
            completionCount: count(goalsCompletions.goalId).as('completion_count')
        }).from(goalsCompletions)
        .where(and(
            gte(goalsCompletions.createdAt, firstDayOfWeek),
            lte(goalsCompletions.createdAt, lastDayOfWeek),
            eq(goalsCompletions.goalId, goalId)
        ))
        .groupBy(goalsCompletions.goalId)
    )

    const pendingGoals = await db
        .with(goalsCompletionCount)
        .select({
            desiredWeeklyFrequency: goals.desiredWeeklyFrequency,
            completionCount: sql`
                COALESCE(${goalsCompletionCount.completionCount}, 0)
            `.mapWith(Number),
        })
        .from(goals)
        .leftJoin(goalsCompletionCount, eq(goalsCompletionCount.goalId, goals.id))
        .where(eq(goals.id, goalId))
        .limit(1)

    const { completionCount, desiredWeeklyFrequency } = pendingGoals[0]

    if(completionCount >= desiredWeeklyFrequency) {
        throw new Error ("Goal already completed this week!")
    }

    const result = await db.insert(goalsCompletions).values({ goalId }).returning()

    const goalCompletions = result[0]

    return {
        goalCompletions,
    }
}