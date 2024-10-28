import dayjs from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear";
import { db } from "../db";
import { goals, goalsCompletions } from "../db/schema";
import { and, count, eq, gte, lte, sql } from "drizzle-orm";

dayjs.extend(weekOfYear)

export async function getWeekPendingGoals() {
    const firstDayOfWeek = dayjs().startOf('week').toDate()
    const lastDayOfWeek = dayjs().endOf('week').toDate()

    const goalsCreatedUpToWeek = db.$with('goals_created_up_to_week').as(
        db.select({
            id: goals.id,
            title: goals.title,
            createdAt: goals.createdAt,
            desiredWeeklyFrequency: goals.desiredWeeklyFrequency
        }).from(goals).where(lte(goals.createdAt, lastDayOfWeek))
    )

    const goalsCompletionCount = db.$with('goals_completion_count').as(
        db.select({
            goalId: goalsCompletions.goalId,
            completionCount: count(goalsCompletions.goalId).as('completion_count')
        }).from(goalsCompletions).where(and(
            gte(goalsCompletions.createdAt, firstDayOfWeek),
            lte(goalsCompletions.createdAt, lastDayOfWeek)
        )).groupBy(goalsCompletions.goalId)
    )

    const pendingGoals = await db
        .with(goalsCreatedUpToWeek, goalsCompletionCount)
        .select({
            id: goalsCreatedUpToWeek.id,
            title: goalsCreatedUpToWeek.title,
            desiredWeeklyFrequency: goalsCreatedUpToWeek.desiredWeeklyFrequency,
            completionCount: sql`
                COALESCE(${goalsCompletionCount.completionCount}, 0)
            `.mapWith(Number),
        })
        .from(goalsCreatedUpToWeek)
        .leftJoin(goalsCompletionCount, eq(goalsCompletionCount.goalId, goalsCreatedUpToWeek.id))

    return { pendingGoals }
}