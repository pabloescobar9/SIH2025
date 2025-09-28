import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export const ProfilePage = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-foreground">User Profile</h1>
      <p className="text-muted-foreground">Manage your account information and preferences</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* User Information */}
        <Card className="shadow-data">
          <CardHeader>
            <CardTitle>User Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="username">Username</Label>
              <Input id="username" placeholder="JohnDoe" />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="johndoe@example.com" />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" type="tel" placeholder="+1234567890" />
            </div>
            <Button className="mt-4">Save Changes</Button>
          </CardContent>
        </Card>

        {/* Account Settings */}
        <Card className="shadow-data">
          <CardHeader>
            <CardTitle>Account Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="password">Change Password</Label>
              <Input id="password" type="password" placeholder="New password" />
            </div>
            <div>
              <Label htmlFor="theme">Theme Preference</Label>
              <Input id="theme" placeholder="Light / Dark / System" />
            </div>
            <Button className="mt-4" variant="destructive">
              Delete Account
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
