import { getCurrentUser } from '@/lib/auth'
import { DashboardLayout } from '@/components/dashboard-layout'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { User, Palette, Bell, Shield } from 'lucide-react'

export default async function SettingsPage() {
  const user = await getCurrentUser()

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-2">
            Manage your account and preferences
          </p>
        </div>

        <div className="grid gap-6 max-w-2xl">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <User className="w-5 h-5 text-muted-foreground" />
              <h2 className="text-lg font-semibold text-foreground">Profile</h2>
            </div>
            <dl className="space-y-2 text-sm">
              <div>
                <dt className="text-muted-foreground">Name</dt>
                <dd className="font-medium text-foreground">{user?.name}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Username</dt>
                <dd className="font-medium text-foreground">{user?.username}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Role</dt>
                <dd className="font-medium text-foreground">{user?.role}</dd>
              </div>
              {user?.email && (
                <div>
                  <dt className="text-muted-foreground">Email</dt>
                  <dd className="font-medium text-foreground">{user.email}</dd>
                </div>
              )}
            </dl>
            <Button variant="outline" size="sm" className="mt-4" disabled>
              Edit profile (coming soon)
            </Button>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Palette className="w-5 h-5 text-muted-foreground" />
              <h2 className="text-lg font-semibold text-foreground">Appearance</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Customize how the app looks on your device.
            </p>
            <Button variant="outline" size="sm" disabled>
              Theme settings (coming soon)
            </Button>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Bell className="w-5 h-5 text-muted-foreground" />
              <h2 className="text-lg font-semibold text-foreground">Notifications</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Configure when and how you receive notifications.
            </p>
            <Button variant="outline" size="sm" disabled>
              Notification preferences (coming soon)
            </Button>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-5 h-5 text-muted-foreground" />
              <h2 className="text-lg font-semibold text-foreground">Security</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Password and security options.
            </p>
            <Button variant="outline" size="sm" disabled>
              Change password (coming soon)
            </Button>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
