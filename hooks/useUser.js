import useSWR from 'swr';

const useUser = (userId)=>{
    const { data, error, isLoading, mutate } = useSWR(
        userId ? `/api/users/${userId}` : null, 
        async () => {
            const response = await fetch(`/api/users/${userId}`);
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.error || 'Failed to fetch user');
            }
            return result;
        },
        {
            dedupingInterval: 60000,
            revalidateOnFocus: false,
            revalidateOnReconnect: false
        }
    );
    return {
        data,error,isLoading,mutate
    }
}
export default useUser