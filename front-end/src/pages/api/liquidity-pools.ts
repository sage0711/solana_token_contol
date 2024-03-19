import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const keyword: string = "jcpKBqhARZ3Z8GXAwV5ECfna3cLoTnEGbAQtp4XsicY"
    const response = await fetch('https://api.raydium.io/v2/main/pairs');
    const liquidityPools = await response.json();

    var temp = {
      data:[] as any[]
    }
    if(keyword == "") {
      for (const element of liquidityPools) {
        temp.data.push({ammId: element.ammId, name: element.name});
      };
    } else {
      for (const element of liquidityPools) {
        if(JSON.stringify(element.baseMint).indexOf(keyword) !== -1){
          temp.data.push(element);
        }
      };
    }

    res.status(200).json(temp.data);
  } catch (error) {
    console.error('Error fetching liquidity pools:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}