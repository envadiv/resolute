import React from 'react'
import Box from '@mui/material/Box';
import { useSelector } from 'react-redux';

export default function StakingPage() {
    const networks = useSelector((state) => state.wallet.networks);
    const chainIDs = Object.keys(networks);

    return (
        <div>
            Multisig
        </div>
    )
}
