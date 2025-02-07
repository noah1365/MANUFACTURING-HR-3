
import { motion } from 'framer-motion'
import { Calendar, Clock, FileCheck, GiftIcon, Handshake, MinusCircle, Users, Wallet } from 'lucide-react'
import StatCards from '../../components/common/StatCards'
import TotalDeductionChart from '../../components/TotalDeductionChart'
import TotalIncentiveRequest from '../../components/TotalIncentiveRequest'

const EmployeeDashboard = () => {
  return (
    <div className='flex-1 overflow-y-auto p-4 relative z-10'>
        <main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
              {/* CARDS */}
            <motion.div
            className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8'
            >
                <StatCards name='Total Salary'icon={Wallet} value={50} color='#6366f1'/>
                <StatCards name='Total Commission'icon={Handshake} value={50} color='#6366f1'/>
                <StatCards name='Total Deductions'icon={MinusCircle} value={50} color='#6366f1'/>
                <StatCards name='Total incentives awarded'icon={GiftIcon} value={50} color='#6366f1'/>
                <StatCards name='Total Leave Used'icon={Calendar} value={50} color='#6366f1'/>
                <StatCards name='Total Overtime'icon={Clock} value={50} color='#6366f1'/>
            </motion.div>
              {/* CHARTS */}
              <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
                <TotalDeductionChart/>
                <TotalIncentiveRequest/>
              </div>
        </main>
    </div>
  )
}

export default EmployeeDashboard
