import { Plus } from "lucide-react";
import { OutlineButton } from "./ui/outline-button";
import { getPendingGoals } from "../http/get-pending-goals";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createGoalCompletion } from "../http/create-goal-complition";

export function PendingGoals() {

    const queryClient = useQueryClient()

    const { data } = useQuery({
        queryKey: ['pending-goals'],
        queryFn: getPendingGoals,
        staleTime: 1000 * 60 // 60 seconds
    })

    if (!data) {
        return null
    }

    async function handleCompleteGoal(goalId: string) {
        await createGoalCompletion(goalId)
        queryClient.invalidateQueries({ queryKey: ['summary'] })
        queryClient.invalidateQueries({ queryKey: ['pending-goals'] })
    }

    return (
        <div className="flex flex-wrap gap-3">
            {data.map(goal => {
                return (
                    <OutlineButton
                        key={goal.id}
                        disabled={goal.completionCount >= goal.desiredWeeklyFrequency}
                        onClick={() => handleCompleteGoal(goal.id)} >
                        <Plus className="text-zinc-600 size-4" />
                        {goal.title}
                    </OutlineButton>
                )
            })}
        </div>
    )
}