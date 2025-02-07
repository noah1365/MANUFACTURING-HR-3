import {LineChart, Line ,XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer} from 'recharts';
import { motion } from 'framer-motion';

const PayrollSummaryChart = () => {
    const salesData=[
        {name: 'Jan', sales: 4000},
        {name: 'Feb', sales: 3000},
        {name: 'Mar', sales: 2000},
        {name: 'Apr', sales: 2780},
        {name: 'May', sales: 1890},
        {name: 'Jun', sales: 2390},
        {name: 'Jul', sales: 4490},
        {name: 'Aug', sales: 5490},
        {name: 'Sep', sales: 6490},
        {name: 'Oct', sales: 7490},
        {name: 'Nov', sales: 8490},
        {name: 'Dec', sales: 9490},
    ]
  return (
    <motion.div
    className='bg-white backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700'  
    initial = {{opacity:0,y:20}}
    animate = {{opacity:1,y:0}}
    transition = {{delay:0.2}}
    >
        <h2 className='text-lg  font-medium mb-4 text-black'>
            Payroll Summary
            <div className='h-80'>
                <ResponsiveContainer width='100%' height='100%'>
                    <LineChart data={salesData}>
                        <CartesianGrid strokeDasharray='3 3' stroke='#4B5563'/>
                        <XAxis dataKey={"name"} stroke='#9ca3af'/>
                        <YAxis stroke='#9ca3af'/>
                        <Tooltip
                        contentStyle={{backgroundColor:"rgba(31,41,55,0.8)",
                        borderColor:"#4B5563"
                        }}
                        itemStyle={{color:"#E5E7EB"}}
                        />
                        <Line type={'monotone'} dataKey={'sales'} stroke='#6366F1' strokeWidth={3} dot={{fill:"#6366F1",strokeWidth:2,r:6 }} activeDot={{r:8,strokeWidth:2}}>

                        </Line>
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </h2>
      
    </motion.div>
  )
}

export default PayrollSummaryChart
