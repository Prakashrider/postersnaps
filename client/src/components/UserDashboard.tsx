import { useState } from 'react';
import { User } from 'firebase/auth';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { apiRequest } from '@/lib/queryClient';
import { User as UserIcon, Calendar, Image, Crown, Award } from 'lucide-react';

interface UserDashboardProps {
  user: User | null;
}

export default function UserDashboard({ user }: UserDashboardProps) {
  const { data: usage } = useQuery({
    queryKey: ['user-usage', user?.uid],
    queryFn: async () => {
      if (!user?.uid) return null;
      const response = await apiRequest('GET', `/api/user-usage/${user.uid}`);
      return response.json();
    },
    enabled: !!user?.uid,
  });

  if (!user) return null;

  const adminEmail = import.meta.env.VITE_ADMIN_EMAIL || 'maritimeriderprakash@gmail.com';
  const isAdmin = user.email === adminEmail;
  const credits = usage?.credits || 0;
  const postersCreated = usage?.postersCreated || 0;

  return (
    <section className="py-12 bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Welcome Back!</h2>
            <p className="text-gray-600">Here's your dashboard overview</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* User Info Card */}
            <Card className="bg-white shadow-lg">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-sm font-medium text-gray-600">
                  <UserIcon className="h-4 w-4 mr-2" />
                  Profile
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="font-semibold text-gray-900">
                    {user.displayName || 'User'}
                  </p>
                  <p className="text-sm text-gray-600 truncate">
                    {user.email}
                  </p>
                  {isAdmin && (
                    <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                      <Crown className="h-3 w-3 mr-1" />
                      Admin
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Credits Card */}
            <Card className="bg-white shadow-lg">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-sm font-medium text-gray-600">
                  <Award className="h-4 w-4 mr-2" />
                  Credits
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-2xl font-bold text-blue-600">
                    {isAdmin ? '∞' : credits}
                  </p>
                  <p className="text-sm text-gray-600">
                    {isAdmin ? 'Unlimited' : 'Available Credits'}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Posters Created Card */}
            <Card className="bg-white shadow-lg">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-sm font-medium text-gray-600">
                  <Image className="h-4 w-4 mr-2" />
                  Posters Created
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-2xl font-bold text-green-600">
                    {postersCreated}
                  </p>
                  <p className="text-sm text-gray-600">
                    Total Generated
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Account Status Card */}
            <Card className="bg-white shadow-lg">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-sm font-medium text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  Account Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Badge className={isAdmin ? "bg-yellow-100 text-yellow-800" : "bg-blue-100 text-blue-800"}>
                    {isAdmin ? 'Premium Admin' : 'Free Plan'}
                  </Badge>
                  <p className="text-sm text-gray-600">
                    Member since {new Date(user.metadata?.creationTime || '').toLocaleDateString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button 
                  className="h-16 flex flex-col items-center justify-center space-y-2"
                  onClick={() => document.getElementById('poster-generator')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  <Image className="h-5 w-5" />
                  <span>Create New Poster</span>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="h-16 flex flex-col items-center justify-center space-y-2"
                  disabled={!isAdmin}
                >
                  <UserIcon className="h-5 w-5" />
                  <span>View My Posters</span>
                </Button>
                
                {!isAdmin && (
                  <Button 
                    variant="outline" 
                    className="h-16 flex flex-col items-center justify-center space-y-2"
                  >
                    <Award className="h-5 w-5" />
                    <span>Buy More Credits</span>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
