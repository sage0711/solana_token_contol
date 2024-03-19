import { useState, useEffect } from 'react';
import axios from 'axios';

interface LiquidityPool {
    ammId: string;
    name: string;
    // Add more fields as needed
}

export default function LiquidityPoolList() {
    const [pools, setPools] = useState<LiquidityPool[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchPools() {
            try {
                const response = await axios.get<LiquidityPool[]>('/api/liquidity-pools');
                console.log(response.data)
                setPools(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching liquidity pools:', error);
            }
        }

        fetchPools();
    }, []);

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-4">Liquidity Pool List</h1>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {pools.map((pool, idx: number) => {
                        return (
                            <li key={idx} className="bg-white rounded-lg shadow-md p-4">
                                <p className="text-xl font-semibold mb-2 break-normal">Pool ID: {pool.ammId}</p>
                                <p className="text-gray-600 break-normal">Pool Name: {pool.name}</p>
                            </li>
                        )}
                    )}
                </ul>
            )}
        </div>
    );
}