import React, { useState } from 'react'
import { GetServerSideProps } from 'next'
import Layout from '../components/Layout'
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]';
import prisma from '../lib/prisma';
import { Investment } from '@prisma/client';


export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getServerSession(context.req, context.res, authOptions);

    if (!session) {
        return {
            redirect: {
                destination: '/auth/login',
                permanent: false,
            },
        };
    }

    const investments = await prisma.investment.findMany({
        where: {
            ownerId: session.user.id,
        },
    });

    return {
        props: {
            investments,
        },
    };
}

type Props = {
    investments: Investment[];
};

const Stocks: React.FC<Props> = ({investments}) => {

    const [stockRowData] = useState(investments);

    const [stockColDefs] = useState([
        {
            headerName: 'No.',
            valueGetter: 'node.rowIndex + 1', // Row index starts from 0, so add 1 for display
            sortable: false,
            filter: false,
            width: 100
        },
        {field: 'stockName', headerName: 'Stock Name'},
        {field: 'quantity', headerName: 'Quantity'},
        {field: 'buyPrice', headerName: 'Buy Price'},
        {field: 'currentPrice', headerName: 'Current Price (editable)', editable: true},
    ]);

    const totalInvestment = investments.reduce((sum, investment) => sum + (investment.quantity * investment.buyPrice), 0);
    const totalCurrentValue = investments.reduce((sum, investment) => sum + (investment.quantity * investment.currentPrice), 0);
    const totalGainLoss = totalCurrentValue - totalInvestment;

    const summaryRowData = [
        {
            totalInvestment: totalInvestment,
            totalCurrentValue: totalCurrentValue,
            totalGainLoss: totalGainLoss
        }
    ];

    const [summaryColDefs] = useState([
        { field: 'totalInvestment', headerName: 'Total Investment' },
        { field: 'totalCurrentValue', headerName: 'Total Current Value' },
        { field: 'totalGainLoss', headerName: 'Total Gain/Loss' },
    ]);

    return (
        <Layout>
            <div className="page flex flex-column w-full align-items-center">
                <div className='flex flex-column w-6'>
                    <h1 className="align-self-start">Stocks</h1>
                    <div
                        className="ag-theme-alpine"
                        style={{height: '190px'}}
                    >
                        <AgGridReact
                            rowData={stockRowData}
                            columnDefs={stockColDefs}
                        ></AgGridReact>
                    </div>
                </div>
                <div className='flex flex-column w-6'>
                    <h1 className="align-self-start">Summary</h1>
                    <div
                        className="ag-theme-alpine w-8"
                        style={{height: '120px'}}
                    >
                        <AgGridReact
                            rowData={summaryRowData}
                            columnDefs={summaryColDefs}
                        ></AgGridReact>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default Stocks
