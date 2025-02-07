import React from 'react'
/* EXPORT */
import CompensationChart from '../../components/common/CompensationChart'
import IncentivesChart from '../../components/common/IncentivesChart'
import PayrollSummaryChart from '../../components/common/PayrollSummaryChart'
import StatCards from '../../components/common/StatCards'
/* PACKAGEs */

import {motion} from 'framer-motion'

/* ICONS */
import { Calendar, FileCheck, GiftIcon, MinusCircle, Users } from 'lucide-react'
import { TbCurrencyPeso } from 'react-icons/tb'

const AdminDashboard = () => {
  return (
    <div className='flex-1 overflow-y-auto p-4 relative z-10'>
        <main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
              {/* CARDS */}
            <motion.div
            className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8'
            >
                <StatCards name='Total Employees Paid'icon={Users} value={50} color='#6366f1'/>
                <StatCards name='Benefits Applied'icon={FileCheck} value={50} color='#6366f1'/>
                <StatCards name='Total Deductions'icon={MinusCircle} value={50} color='#6366f1'/>
                <StatCards name='Total incentives awarded'icon={GiftIcon} value={50} color='#6366f1'/>
                <StatCards name='Total Leave Used'icon={Calendar} value={50} color='#6366f1'/>
                <StatCards name='Total Compensation Cost'icon={TbCurrencyPeso} value={50} color='#6366f1'/>
            </motion.div>
              {/* CHARTS */}
              <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
            <PayrollSummaryChart/>
            <CompensationChart/>
            <IncentivesChart/>
              </div>
        </main>
    </div>
  )
}

export default AdminDashboard