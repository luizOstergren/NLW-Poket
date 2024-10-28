import { client, db } from "."
import { goals, goalsCompletions } from "./schema"
import dayjs from 'dayjs'

async function seed() {
    await db.delete(goalsCompletions)
    await db.delete(goals)

     const result = await db.insert(goals).values([
        {title: 'acordar cedo', desiredWeeklyFrequency: 3},
        {title: 'ler um livro', desiredWeeklyFrequency: 5},
        {title: 'exercitar', desiredWeeklyFrequency: 2},
        {title: 'estudar', desiredWeeklyFrequency: 4}
    ]).returning()
    
    const startOfWeek = dayjs().startOf("week")

    await db.insert(goalsCompletions).values([
        { goalId: result[0].id, createdAt: startOfWeek.toDate() },
        { goalId: result[1].id, createdAt: startOfWeek.add(1, 'day').toDate() },
        
    ])
}

seed().finally(() => {
    client.end()
})