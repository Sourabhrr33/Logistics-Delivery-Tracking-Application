import React from 'react'
import {
  PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip,
  LineChart, Line, CartesianGrid
} from 'recharts'
import { useAppSelector } from '../store/hooks'
import { selectOrderStats } from '../store/selectors/dashboardSelectors'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

export default function AdminDashboardCharts() {
  const { statusCounts, timelineCounts } = useAppSelector(selectOrderStats)

  const statusData = Object.entries(statusCounts).map(([name, value]) => ({
    name,
    value
  }))

  const timelineData = Object.entries(timelineCounts).map(([date, count]) => ({
    date,
    count
  }))

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">

      {/* Pie Chart — Orders by Status */}
      <div className="bg-white shadow p-4 rounded">
        <h3 className="text-lg font-semibold mb-3">Orders by Status</h3>
        <PieChart width={300} height={250}>
          <Pie
            data={statusData}
            cx={150}
            cy={120}
            outerRadius={80}
            dataKey="value"
            label
          >
            {statusData.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </div>

      {/* Line Chart — Orders Over Time */}
      <div className="bg-white shadow p-4 rounded">
        <h3 className="text-lg font-semibold mb-3">Orders Over Time</h3>
        <LineChart width={330} height={250} data={timelineData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Line type="monotone" dataKey="count" stroke="#8884d8" />
        </LineChart>
      </div>
    </div>
  )
}
