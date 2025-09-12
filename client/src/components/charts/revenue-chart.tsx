import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const monthlyData = [
  { month: 'Jan', revenue: 45000, estimates: 12 },
  { month: 'Feb', revenue: 52000, estimates: 15 },
  { month: 'Mar', revenue: 48000, estimates: 13 },
  { month: 'Apr', revenue: 61000, estimates: 18 },
  { month: 'May', revenue: 55000, estimates: 16 },
  { month: 'Jun', revenue: 67000, estimates: 20 },
];

const divisionData = [
  { name: 'Single-Family', value: 65, color: 'hsl(203.8863, 88.2845%, 53.1373%)' },
  { name: 'Multi-Family', value: 20, color: 'hsl(147.1429, 78.5047%, 41.9608%)' },
  { name: 'R&R', value: 15, color: 'hsl(42.0290, 92.8251%, 56.2745%)' },
];

export function RevenueChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Revenue</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']} />
            <Bar dataKey="revenue" fill="hsl(203.8863, 88.2845%, 53.1373%)" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function DivisionChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue by Division</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={divisionData}
              cx="50%"
              cy="50%"
              outerRadius={80}
              dataKey="value"
              label={({ name, value }) => `${name}: ${value}%`}
            >
              {divisionData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
