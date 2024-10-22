import React, { useRef, useState } from 'react'
import { GetServerSideProps } from 'next'
import Layout from '../components/Layout'
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]';
import prisma from '../lib/prisma';
import { Investment } from '@prisma/client';
import { ColDef } from '@ag-grid-community/core';


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
    const gridRef = useRef<AgGridReact>(null); // Reference for the grid

    const [stockRowData, setStockRowData] = useState(investments);

    const [stockColDefs] = useState([
        {
            headerName: 'No.',
            valueGetter: 'node.rowIndex + 1',
            sortable: false,
            filter: false,
            width: 100
        } as ColDef,
        {field: 'stockName', headerName: 'Stock Name'} as any,
        {field: 'quantity', headerName: 'Quantity'} as any,
        {field: 'buyPrice', headerName: 'Buy Price'} as any,
        {field: 'currentPrice', headerName: 'Current Price (editable)', editable: true} as any,
    ]);

    const calculateSummary = (data: Investment[]) => {
        const totalInvestment = data.reduce(
            (sum, investment) => sum + investment.quantity * investment.buyPrice,
            0
        );
        const totalCurrentValue = data.reduce(
            (sum, investment) => sum + investment.quantity * investment.currentPrice,
            0
        );
        const totalGainLoss = totalCurrentValue - totalInvestment;
        return [
            {
                totalInvestment,
                totalCurrentValue,
                totalGainLoss,
            },
        ];
    };

    const [summaryRowData, setSummaryRowData] = useState(() =>
        calculateSummary(stockRowData)
    );

    const [summaryColDefs] = useState([
        { field: 'totalInvestment', headerName: 'Total Investment' } as any,
        { field: 'totalCurrentValue', headerName: 'Total Current Value' } as any,
        { field: 'totalGainLoss', headerName: 'Total Gain/Loss' } as any,
    ]);

    const handleCellValueChanged = async (event: any) => {
        const updatedData = [...stockRowData];
        const rowIndex = event.node.rowIndex;
        const investment = updatedData[rowIndex];
        investment.currentPrice = event.newValue;

        setStockRowData(updatedData);
        setSummaryRowData(calculateSummary(updatedData));

        try {
            await fetch('/api/investment/update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: investment.id,
                    currentPrice: investment.currentPrice,
                }),
            });
        } catch (error) {
            console.error('Error updating current price:', error);
        }
    };
    const handleExportAsCSV = () => {
        if (gridRef.current) {
            gridRef.current.api.exportDataAsCsv({fileName: 'stock_data'});
        }
    };

    return (
        <Layout>
            <div className="page flex flex-column w-full align-items-center">
                <div className="flex flex-column w-6">
                    <div className='m-2 flex flex-row align-items-center justify-content-between'>
                        <h1 className="m-0">Stocks</h1>
                        <button
                            onClick={handleExportAsCSV}
                            className="p-button p-component p-button-primary p-mt-2"
                            style={{alignSelf: 'flex-end'}}
                        >
                            Export to CSV
                        </button>
                    </div>
                    <div
                        className="ag-theme-alpine"
                        style={{height: '190px'}}
                    >
                        <AgGridReact
                            ref={gridRef}
                            rowData={stockRowData}
                            columnDefs={stockColDefs}
                            onCellValueChanged={handleCellValueChanged}
                        ></AgGridReact>
                    </div>
                </div>
                <div className="flex flex-column w-6">
                    <h1 className="m-2 align-self-start">Summary</h1>
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
