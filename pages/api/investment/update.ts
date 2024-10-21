import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { id, currentPrice } = req.body;

        try {
            const updatedInvestment = await prisma.investment.update({
                where: { id },
                data: { currentPrice },
            });

            res.status(200).json({ success: true, investment: updatedInvestment });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Error updating investment.' });
        }
    } else {
        res.status(405).json({ success: false, message: 'Method not allowed' });
    }
}
