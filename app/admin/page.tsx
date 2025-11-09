"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { adminFetch } from "@/lib/admin-api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  Users,
  AlertCircle,
  TrendingUp,
  Shield,
  FileText,
  Settings,
  MapPin,
  Activity,
  ClipboardList,
  UserCog,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface AdminStats {
  totalUsers: number;
  totalIssues: number;
  pendingIssues: number;
  resolvedIssues: number;
  activeUsers: number;
  resolutionRate: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    // Auto-login as admin for seamless access
    const setupAdminAccess = () => {
      // Create a fake admin user token and store it
      const fakeAdminUser = {
        id: "admin-bypass-001",
        email: "admin@ourstreet.local",
        name: "Administrator",
        role: "admin",
      };

      // Store in localStorage for API calls
      localStorage.setItem("citypulse_user", JSON.stringify(fakeAdminUser));

      // Create a simple JWT-like token (for demo purposes)
      const fakeToken = btoa(
        JSON.stringify({
          userId: fakeAdminUser.id,
          email: fakeAdminUser.email,
          role: "admin",
          exp: Date.now() + 86400000, // 24 hours
        }),
      );

      localStorage.setItem("citypulse_auth_token", fakeToken);
    };

    setupAdminAccess();

    // Authentication bypass - always load stats
    fetchAdminStats();
  }, []);

  const fetchAdminStats = async () => {
    try {
      const response = await adminFetch("/api/admin/stats");

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // Extract stats from the response
          const statsData = data.data;
          setStats({
            totalUsers: statsData.totalUsers || 0,
            totalIssues: statsData.totalIssues || 0,
            pendingIssues: statsData.pendingIssues || 0,
            resolvedIssues: statsData.resolvedIssues || 0,
            activeUsers: statsData.activeUsers || 0,
            resolutionRate: statsData.resolutionRate || 0,
          });
        }
      }
    } catch (error) {
      console.error("Failed to fetch admin stats:", error);
    } finally {
      setLoadingStats(false);
    }
  };

  // Show loading state
  if (loadingStats) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-12 w-64 mb-8" />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const adminFeatures = [
    {
      title: "Analytics Dashboard",
      description:
        "View ward-wise analytics, performance metrics, and impact reports",
      icon: BarChart3,
      href: "/admin/analytics",
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-950",
    },
    {
      title: "Issue Management",
      description:
        "Manage all reported issues, update statuses, and assign priorities",
      icon: ClipboardList,
      href: "/admin/issues",
      color: "text-orange-600 dark:text-orange-400",
      bgColor: "bg-orange-50 dark:bg-orange-950",
      badge: stats?.pendingIssues,
    },
    {
      title: "User Management",
      description: "View and manage user accounts, roles, and permissions",
      icon: Users,
      href: "/admin/users",
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-50 dark:bg-green-950",
    },
    {
      title: "Audit Logs",
      description: "Review system activity, user actions, and security events",
      icon: FileText,
      href: "/admin/audit-logs",
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-50 dark:bg-purple-950",
    },
    {
      title: "Ward Management",
      description: "Configure wards, districts, and location boundaries",
      icon: MapPin,
      href: "/admin/wards",
      color: "text-pink-600 dark:text-pink-400",
      bgColor: "bg-pink-50 dark:bg-pink-950",
    },
    {
      title: "System Settings",
      description: "Configure system settings, SLA times, and notifications",
      icon: Settings,
      href: "/admin/settings",
      color: "text-indigo-600 dark:text-indigo-400",
      bgColor: "bg-indigo-50 dark:bg-indigo-950",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-2 sm:gap-3 mb-2">
            <div className="p-1.5 sm:p-2 bg-black dark:bg-white rounded-lg">
              <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-white dark:text-black" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-black dark:text-white">
              Admin Dashboard
            </h1>
          </div>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Welcome back, {user?.name || "Administrator"}. Manage and monitor
            your OurStreet platform.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-6 sm:mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 p-4 sm:p-6">
              <CardTitle className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Users
              </CardTitle>
              <Users className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600 dark:text-gray-400" />
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              {loadingStats ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <div className="text-xl sm:text-2xl font-bold text-black dark:text-white">
                  {stats?.totalUsers || 0}
                </div>
              )}
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Active users this month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 p-4 sm:p-6">
              <CardTitle className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Issues
              </CardTitle>
              <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600 dark:text-gray-400" />
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              {loadingStats ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <div className="text-xl sm:text-2xl font-bold text-black dark:text-white">
                  {stats?.totalIssues || 0}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Pending Issues
              </CardTitle>
              <Activity className="h-4 w-4 text-orange-600 dark:text-orange-400" />
            </CardHeader>
            <CardContent>
              {loadingStats ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  {stats?.pendingIssues || 0}
                </div>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 p-4 sm:p-6">
              <CardTitle className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">
                Resolution Rate
              </CardTitle>
              <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600 dark:text-gray-400" />
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              {loadingStats ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <div className="text-xl sm:text-2xl font-bold text-black dark:text-white">
                  {stats?.resolutionRate || 0}%
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Admin Features Grid */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-black dark:text-white mb-4">
            Admin Features
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {adminFeatures.map((feature) => {
              const Icon = feature.icon;
              return (
                <Link key={feature.href} href={feature.href}>
                  <Card className="h-full transition-all hover:shadow-lg hover:scale-[1.02] cursor-pointer">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div
                          className={`p-3 rounded-lg ${feature.bgColor} mb-3`}
                        >
                          <Icon className={`h-6 w-6 ${feature.color}`} />
                        </div>
                        {feature.badge !== undefined && feature.badge > 0 && (
                          <Badge variant="destructive">{feature.badge}</Badge>
                        )}
                      </div>
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                      <CardDescription className="text-sm">
                        {feature.description}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Link href="/admin/issues?status=pending">
                <Button variant="outline">
                  <AlertCircle className="mr-2 h-4 w-4" />
                  View Pending Issues
                </Button>
              </Link>
              <Link href="/admin/analytics">
                <Button variant="outline">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Generate Report
                </Button>
              </Link>
              <Link href="/admin/users?role=citizen">
                <Button variant="outline">
                  <UserCog className="mr-2 h-4 w-4" />
                  Manage Users
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline">Back to Home</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
