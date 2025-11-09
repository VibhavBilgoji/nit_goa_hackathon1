"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MapPin, AlertCircle, CheckCircle, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { InteractiveMap } from "@/components/interactive-map";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BorderBeam } from "@/components/magicui/border-beam";
import { Issue } from "@/lib/types";
import toast from "react-hot-toast";

// Type for map-compatible issues
interface MapIssue {
  id: string;
  title: string;
  description: string;
  category: string;
  status: "open" | "in-progress" | "resolved" | "closed";
  location: { lat: number; lng: number };
  address: string;
  date: string;
  photoUrl?: string;
}

const statusColors = {
  open: "bg-red-500 dark:bg-red-600 text-white dark:text-white",
  "in-progress": "bg-yellow-500 dark:bg-yellow-600 text-black dark:text-black",
  resolved: "bg-blue-500 dark:bg-blue-600 text-white dark:text-white",
};

const statusIcons = {
  open: AlertCircle,
  "in-progress": Clock,
  resolved: CheckCircle,
};

// Default location (Goa, India)
const DEFAULT_LOCATION = { lat: 15.2993, lng: 74.124 };

export default function MapPage() {
  const router = useRouter();
  const [issues, setIssues] = useState<MapIssue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedIssue, setSelectedIssue] = useState<string | null>(null);
  const [focusOnMarker, setFocusOnMarker] = useState<string | null>(null);

  // Form state
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formCategory, setFormCategory] = useState("");
  const [formPhoto, setFormPhoto] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch issues from API
  useEffect(() => {
    const fetchIssues = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          "/api/issues?limit=100&sortBy=createdAt&sortOrder=desc",
        );
        const data = await response.json();

        if (data.success && data.data?.issues) {
          // Transform API issues to map format
          const transformedIssues: MapIssue[] = data.data.issues.map(
            (issue: Issue) => ({
              id: issue.id,
              title: issue.title,
              description: issue.description,
              category: formatCategory(issue.category),
              status: issue.status,
              location: {
                lat: issue.coordinates.lat,
                lng: issue.coordinates.lng,
              },
              address: issue.location,
              date: new Date(issue.createdAt).toLocaleDateString(),
              photoUrl: issue.photoUrl,
            }),
          );
          setIssues(transformedIssues);
        } else {
          toast.error("Failed to load issues");
        }
      } catch (error) {
        console.error("Error fetching issues:", error);
        toast.error("Error loading issues. Please refresh the page.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchIssues();
  }, []);

  // Format category for display
  const formatCategory = (category: string): string => {
    const categoryMap: Record<string, string> = {
      pothole: "Road",
      streetlight: "Lighting",
      garbage: "Sanitation",
      water_leak: "Water",
      road: "Road",
      sanitation: "Sanitation",
      drainage: "Drainage",
      electricity: "Electricity",
      traffic: "Traffic",
      other: "Other",
    };
    return categoryMap[category] || category;
  };

  const handleMarkerClick = (id: string | number) => {
    const issueId = id.toString();
    setSelectedIssue(issueId);
    setFocusOnMarker(issueId);
  };

  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-black">
      {/* Main Content */}
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {/* Page Header */}
          <div className="mb-6 sm:mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black dark:text-white mb-2 px-2 sm:px-0">
                Interactive Issue Map
              </h1>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 px-2 sm:px-0">
                View reported civic issues on the map and track their resolution
                progress in real-time
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <Card
              className="relative overflow-hidden hover:shadow-2xl hover:shadow-purple-500/20 hover:bg-purple-50/50 dark:hover:bg-purple-950/30 cursor-pointer group"
              style={{
                transition:
                  "box-shadow 300ms ease-out, background-color 300ms ease-out",
              }}
            >
              <BorderBeam duration={8} delay={0} />
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 sm:p-6">
                <CardTitle className="text-xs sm:text-sm font-medium group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300">
                  Total Issues
                </CardTitle>
                <MapPin className="size-4 sm:size-5 text-gray-500 dark:text-gray-400 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-all duration-300 group-hover:scale-110" />
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <div className="text-xl sm:text-2xl font-bold text-black dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 sm:group-hover:text-4xl transition-all duration-300 ease-out">
                  {issues.length}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 group-hover:text-purple-500 transition-colors duration-300">
                  Reported by citizens
                </p>
              </CardContent>
            </Card>
            <Card
              className="relative overflow-hidden hover:shadow-2xl hover:shadow-red-500/20 hover:bg-red-50/50 dark:hover:bg-red-950/30 cursor-pointer group"
              style={{
                transition:
                  "box-shadow 300ms ease-out, background-color 300ms ease-out",
              }}
            >
              <BorderBeam duration={8} delay={2} />
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 sm:p-6">
                <CardTitle className="text-xs sm:text-sm font-medium group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors duration-300">
                  Open Issues
                </CardTitle>
                <AlertCircle className="size-4 sm:size-5 text-gray-500 dark:text-gray-400 group-hover:text-red-600 dark:group-hover:text-red-400 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12" />
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <div className="text-xl sm:text-2xl font-bold text-black dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 sm:group-hover:text-4xl transition-all duration-300 ease-out">
                  {issues.filter((issue) => issue.status === "open").length}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 group-hover:text-red-500 transition-colors duration-300">
                  Awaiting resolution
                </p>
              </CardContent>
            </Card>
            <Card
              className="relative overflow-hidden hover:shadow-2xl hover:shadow-yellow-500/20 hover:bg-yellow-50/50 dark:hover:bg-yellow-950/30 cursor-pointer group"
              style={{
                transition:
                  "box-shadow 300ms ease-out, background-color 300ms ease-out",
              }}
            >
              <BorderBeam duration={8} delay={4} />
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 sm:p-6">
                <CardTitle className="text-xs sm:text-sm font-medium group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors duration-300">
                  In Progress
                </CardTitle>
                <Clock className="size-4 sm:size-5 text-gray-500 dark:text-gray-400 group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12" />
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <div className="text-xl sm:text-2xl font-bold text-black dark:text-white group-hover:text-yellow-600 dark:group-hover:text-yellow-400 sm:group-hover:text-4xl transition-all duration-300 ease-out">
                  {
                    issues.filter((issue) => issue.status === "in-progress")
                      .length
                  }
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 group-hover:text-yellow-500 transition-colors duration-300">
                  Being worked on
                </p>
              </CardContent>
            </Card>
            <Card
              className="relative overflow-hidden hover:shadow-2xl hover:shadow-emerald-500/20 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/30 cursor-pointer group"
              style={{
                transition:
                  "box-shadow 300ms ease-out, background-color 300ms ease-out",
              }}
            >
              <BorderBeam duration={8} delay={6} />
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 sm:p-6">
                <CardTitle className="text-xs sm:text-sm font-medium group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-300">
                  Resolved
                </CardTitle>
                <CheckCircle className="size-4 sm:size-5 text-gray-500 dark:text-gray-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-all duration-300 group-hover:scale-110 group-hover:rotate-[360deg]" />
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <div className="text-xl sm:text-2xl font-bold text-black dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 sm:group-hover:text-4xl transition-all duration-300 ease-out">
                  {issues.filter((issue) => issue.status === "resolved").length}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 group-hover:text-emerald-500 transition-colors duration-300">
                  Successfully fixed
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Map Section */}
          <Card className="mb-6 sm:mb-8">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <MapPin className="size-4 sm:size-5" />
                Live Issue Map
              </CardTitle>
            </CardHeader>
            <CardContent className="p-2 sm:p-4 md:p-6">
              <InteractiveMap
                center={[73.8278, 15.4909]}
                zoom={12}
                markers={issues.map((issue) => ({
                  id: issue.id,
                  position: [issue.location.lng, issue.location.lat],
                  title: issue.title,
                  status: issue.status,
                }))}
                onMarkerClick={handleMarkerClick}
                height="400px"
                showUserLocation={true}
                focusOnMarker={focusOnMarker}
              />
            </CardContent>
          </Card>

          {/* Issue List */}
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-lg sm:text-xl">
                Recent Issues
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              {isLoading ? (
                <div className="text-center py-6 sm:py-8 text-sm sm:text-base text-gray-500 dark:text-gray-400">
                  Loading issues...
                </div>
              ) : issues.length === 0 ? (
                <div className="text-center py-6 sm:py-8 text-sm sm:text-base text-gray-500 dark:text-gray-400">
                  No issues reported yet.
                </div>
              ) : (
                <div className="space-y-3 sm:space-y-4">
                  {issues.map((issue) => {
                    const StatusIcon =
                      statusIcons[issue.status as keyof typeof statusIcons] ||
                      AlertCircle;
                    return (
                      <div
                        key={issue.id}
                        className={`p-3 sm:p-4 rounded-lg border border-gray-200 dark:border-gray-800 transition-colors cursor-pointer hover:border-gray-300 dark:hover:border-gray-700 ${
                          selectedIssue === issue.id
                            ? "bg-gray-50 dark:bg-gray-900"
                            : ""
                        }`}
                        onClick={() => {
                          setSelectedIssue(issue.id);
                          router.push(`/issues/${issue.id}`);
                        }}
                      >
                        <div className="flex flex-col sm:flex-row items-start justify-between gap-3 sm:gap-4">
                          <div className="flex-1 w-full sm:w-auto">
                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                              <h3 className="font-semibold text-black dark:text-white text-sm sm:text-base">
                                {issue.title}
                              </h3>
                              <Badge
                                className={
                                  statusColors[
                                    issue.status as keyof typeof statusColors
                                  ] || statusColors.open
                                }
                              >
                                <StatusIcon className="size-3 mr-1" />
                                {issue.status.replace("-", " ")}
                              </Badge>
                            </div>
                            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                              {issue.description}
                            </p>
                            <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs text-gray-500 dark:text-gray-500">
                              <span className="flex items-center gap-1">
                                <MapPin className="size-3" />
                                {issue.address}
                              </span>
                              <span>{issue.category}</span>
                              <span>{issue.date}</span>
                            </div>
                          </div>
                          {issue.photoUrl && (
                            <div className="w-full sm:w-auto sm:ml-4 mt-3 sm:mt-0">
                              <img
                                src={issue.photoUrl}
                                alt={issue.title}
                                className="w-full sm:w-20 h-40 sm:h-20 object-cover rounded"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
