import { motion } from "framer-motion";
import { Bar, BarChart, CartesianGrid, Cell, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const SALES_CHANNEL_DATA = [
  { name: "CEO", recognition: 15000, performanceBonus: 20000, salesCommission: 24800 },
  { name: "Reseller", recognition: 12000, performanceBonus: 17000, salesCommission: 16600 },
  { name: "Reseller Sales Head", recognition: 11000, performanceBonus: 14500, salesCommission: 12700 },
  { name: "Production Head", recognition: 7000, performanceBonus: 9200, salesCommission: 8600 },
  { name: "Secretary", recognition: 7000, performanceBonus: 9200, salesCommission: 8600 },
];

const IncentivesChart = () => {
  return (
    <motion.div
      className="bg-white backdrop-blur-md shadow-lg rounded-xl p-6 lg:col-span-2 border border-gray-700"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.4 }}
    >
      <h2 className="text-lg font-medium mb-4 text-black">Incentives by Position</h2>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={SALES_CHANNEL_DATA}>
            <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
            <XAxis dataKey="name" stroke="#4B5563" />
            <YAxis stroke="#4B5563" />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(31,41,55,0.8)",
                borderColor: "#4B5563",
              }}
              itemStyle={{ color: "#CBD5E0" }}
            />
            <Legend />

            <Bar dataKey="recognition" fill={COLORS[0]}>
              {SALES_CHANNEL_DATA.map((entry, index) => (
                <Cell key={`cell-${index}-recognition`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
            <Bar dataKey="performanceBonus" fill={COLORS[1]}>
              {SALES_CHANNEL_DATA.map((entry, index) => (
                <Cell key={`cell-${index}-performanceBonus`} fill={COLORS[(index + 1) % COLORS.length]} />
              ))}
            </Bar>
            <Bar dataKey="salesCommission" fill={COLORS[2]}>
              {SALES_CHANNEL_DATA.map((entry, index) => (
                <Cell key={`cell-${index}-salesCommission`} fill={COLORS[(index + 2) % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default IncentivesChart;
