"use client"
import React from 'react'
import useUserId from '@/hooks/userUserId'
import useUser from '@/hooks/useUser'
import { useRouter } from 'next/navigation';
import useSWR from 'swr';

const FeedbackPage = () => {

    const { data, error } = useSWR('allOrders', async () => {
        const response = await fetch('/api/feedback');
        const result = await response.json();
        if (!response.ok) {
            throw new Error(result.error || 'Failed to fetch feedback');
        }
        return result;
    });
    const {userId} = useUserId()
    
    const {data:user,isLoading} = useUser(userId)
    const route = useRouter()
    console.log(user?.user);

    if (error) return <div>Error loading data</div>;
    if (!data) return <div>Loading...</div>;
    console.log(data?.res);
    const feedbacks = data?.res

    if(isLoading){
        return <p>Loading...</p>
    }


    if(user?.user?.role !== "admin"){
        route.push('/')
    }

  return (
    <div className="container mx-auto min-h-screen">
        <div className="text-3xl font-semibold mb-4">Feedback</div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {feedbacks?.map(feedback => (
                <div key={feedback.id} className="p-4 border rounded shadow">
                    <div className="text-lg font-semibold mb-2">{feedback.email}</div>
                    <div className="mb-2">{feedback.feedback_text}</div>
                    <div className="text-sm text-gray-500">{new Date(feedback.created_at).toLocaleString()}</div>

                </div>
            ))}
        </div>
    </div>
  )
}

export default FeedbackPage