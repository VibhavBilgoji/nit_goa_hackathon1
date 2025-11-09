import { NextRequest, NextResponse } from "next/server";
import { issueDb } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";
import { ApiResponse, DashboardStats, IssueCategory } from "@/lib/types";

// GET /api/dashboard - Get dashboard statistics
export async function GET(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized - Please login",
        } as ApiResponse,
        { status: 401 },
      );
    }

    const allIssues = await issueDb.getAll();

    // Calculate basic stats
    const totalIssues = allIssues.length;
    const openIssues = allIssues.filter((i) => i.status === "open").length;
    const inProgressIssues = allIssues.filter(
      (i) => i.status === "in-progress",
    ).length;
    const resolvedIssues = allIssues.filter(
      (i) => i.status === "resolved",
    ).length;

    // Calculate average resolution time
    const resolvedIssuesWithTime = allIssues.filter(
      (i) => i.status === "resolved" && i.resolvedAt,
    );
    let averageResolutionTime = 0;
    if (resolvedIssuesWithTime.length > 0) {
      const totalTime = resolvedIssuesWithTime.reduce((sum, issue) => {
        const created = new Date(issue.createdAt).getTime();
        const resolved = new Date(issue.resolvedAt!).getTime();
        const days = (resolved - created) / (1000 * 60 * 60 * 24);
        return sum + days;
      }, 0);
      averageResolutionTime = totalTime / resolvedIssuesWithTime.length;
    }

    // Category breakdown
    const categoryMap = new Map<string, number>();
    allIssues.forEach((issue) => {
      const count = categoryMap.get(issue.category) || 0;
      categoryMap.set(issue.category, count + 1);
    });

    const categoryBreakdown = Array.from(categoryMap.entries()).map(
      ([category, count]) => ({
        category: category as IssueCategory,
        count,
      }),
    );

    // Recent activity (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentIssues = allIssues.filter(
      (i) => new Date(i.createdAt) >= thirtyDaysAgo,
    );

    // Group by date
    const activityMap = new Map<string, number>();
    recentIssues.forEach((issue) => {
      const date = new Date(issue.createdAt).toISOString().split("T")[0];
      const count = activityMap.get(date) || 0;
      activityMap.set(date, count + 1);
    });

    const recentActivity = Array.from(activityMap.entries())
      .map(([date, count]) => ({
        date,
        count,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    const stats: DashboardStats = {
      totalIssues,
      openIssues,
      inProgressIssues,
      resolvedIssues,
      totalReports: totalIssues,
      averageResolutionTime: Math.round(averageResolutionTime * 10) / 10,
      categoryBreakdown,
      recentActivity,
    };

    return NextResponse.json(
      {
        success: true,
        data: stats,
      } as ApiResponse<DashboardStats>,
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch dashboard statistics",
      } as ApiResponse,
      { status: 500 },
    );
  }
}
