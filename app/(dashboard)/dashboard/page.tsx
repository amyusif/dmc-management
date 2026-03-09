import { DashboardLayout } from '@/components/dashboard-layout'
import { StatsCard } from '@/components/stats-card'
import { AppointmentTrendChart } from '@/components/appointment-trend-chart'
import { Card } from '@/components/ui/card'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/db'
import {
  Users,
  Calendar,
  FileText,
  TrendingUp,
  BarChart3,
} from 'lucide-react'

async function getDashboardStats() {
  try {
    const patientCount = await prisma.patient.count()
    const staffCount = await prisma.user.count({
      where: { role: { in: ['DOCTOR', 'NURSE', 'STAFF'] } },
    })
    const appointmentCount = await prisma.appointment.count()
    
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    
    const todayAppointments = await prisma.appointment.count({
      where: {
        appointmentDate: { gte: today, lt: tomorrow },
        status: 'SCHEDULED',
      },
    })
    
    return { patientCount, staffCount, appointmentCount, todayAppointments }
  } catch (error) {
    console.error('Dashboard stats error:', error)
    return { patientCount: 0, staffCount: 0, appointmentCount: 0, todayAppointments: 0 }
  }
}

async function getAppointmentTrends() {
  try {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (6 - i))
      date.setHours(0, 0, 0, 0)
      return date
    })

    const trends = await Promise.all(
      last7Days.map(async (date) => {
        const nextDay = new Date(date)
        nextDay.setDate(nextDay.getDate() + 1)
        
        const count = await prisma.appointment.count({
          where: {
            appointmentDate: { gte: date, lt: nextDay },
          },
        })
        
        return {
          date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          appointments: count,
        }
      })
    )
    
    return trends
  } catch (error) {
    console.error('Trends error:', error)
    return []
  }
}

async function getRecentRecords() {
  try {
    const records = await prisma.medicalRecord.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        patient: true,
        doctor: { include: { user: true } },
      },
    })
    
    return records.map((record) => ({
      ...record,
      patient: { firstName: record.patient.firstName, lastName: record.patient.lastName },
      doctor: { user: { name: record.doctor.user.name } },
      recordDate: record.createdAt,
    }))
  } catch (error) {
    console.error('Records error:', error)
    return []
  }
}

export default async function DashboardPage() {
  const user = await getCurrentUser()
  const stats = await getDashboardStats()
  const appointmentTrends = await getAppointmentTrends()
  const recentRecords = await getRecentRecords()

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-muted-foreground mt-2">
            Here's an overview of your hospital operations
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            label="Total Patients"
            value={stats.patientCount}
            icon={<Users className="w-12 h-12" />}
            trend={{ value: 12, isPositive: true }}
          />
          <StatsCard
            label="Staff Members"
            value={stats.staffCount}
            icon={<Users className="w-12 h-12" />}
            trend={{ value: 5, isPositive: true }}
          />
          <StatsCard
            label="Total Appointments"
            value={stats.appointmentCount}
            icon={<Calendar className="w-12 h-12" />}
            trend={{ value: 8, isPositive: true }}
          />
          <StatsCard
            label="Today's Scheduled"
            value={stats.todayAppointments}
            icon={<TrendingUp className="w-12 h-12" />}
            trend={{ value: 3, isPositive: false }}
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Appointments Trend */}
          <Card className="p-6">
            <div className="mb-6">
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Appointments Trend
              </h2>
              <p className="text-sm text-muted-foreground">Last 7 days</p>
            </div>
            <AppointmentTrendChart data={appointmentTrends} />
          </Card>

          {/* Department Distribution */}
          <Card className="p-6">
            <div className="mb-6">
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Appointments by Status
              </h2>
              <p className="text-sm text-muted-foreground">Distribution</p>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Scheduled</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-secondary rounded-full h-2"></div>
                  <span className="text-sm font-bold w-12 text-right">65%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Completed</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 bg-accent rounded-full h-2"></div>
                  <span className="text-sm font-bold w-12 text-right">28%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Cancelled</span>
                <div className="flex items-center gap-2">
                  <div className="w-8 bg-destructive rounded-full h-2"></div>
                  <span className="text-sm font-bold w-12 text-right">7%</span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Recent Records */}
        <Card className="p-6">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Recent Medical Records
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold text-foreground">
                    Patient
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">
                    Doctor
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">
                    Diagnosis
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentRecords.map((record) => (
                  <tr key={record.id} className="border-b border-border hover:bg-card/50">
                    <td className="py-3 px-4 text-foreground">
                      {record.patient.firstName} {record.patient.lastName}
                    </td>
                    <td className="py-3 px-4 text-foreground">
                      {record.doctor.user.name}
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">
                      {record.diagnosis.substring(0, 50)}...
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">
                      {new Date(record.recordDate).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  )
}
