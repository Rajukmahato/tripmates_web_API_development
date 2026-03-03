'use client';

import React, { useEffect, useState } from 'react';
import {
  getAnalyticsOverview,
  getUserGrowth,
  getTripTrends,
  getMatchStats,
  getPerformanceMetrics,
} from '@/lib/api/admin/analytics';
import { AnalyticsOverview, AnalyticsPeriodData, SystemPerformance, MatchStats } from '@/app/_types/common.types';
import { Card } from '@/app/_components/ui/card';
import { Badge } from '@/app/_components/ui/badge';
import { Loading } from '@/app/_components/ui/loading';
import {
  Users,
  MapPin,
  Heart,
  MessageCircle,
  TrendingUp,
  Activity,
  Database,
  Zap,
} from 'lucide-react';

export default function AdminAnalyticsPage() {
  const [overview, setOverview] = useState<AnalyticsOverview | null>(null);
  const [userGrowth, setUserGrowth] = useState<AnalyticsPeriodData[]>([]);
  const [tripTrends, setTripTrends] = useState<AnalyticsPeriodData[]>([]);
  const [matchStats, setMatchStats] = useState<MatchStats | null>(null);
  const [performance, setPerformance] = useState<SystemPerformance | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [period, setPeriod] = useState<'week' | 'month' | 'year'>('month');

  useEffect(() => {
    fetchAllAnalytics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [period]);

  const fetchAllAnalytics = async () => {
    setIsLoading(true);
    try {
      const [overviewData, growthData, trendsData, statsData, perfData] = await Promise.all([
        getAnalyticsOverview(),
        getUserGrowth(period),
        getTripTrends(period),
        getMatchStats(),
        getPerformanceMetrics(),
      ]);

      setOverview(overviewData);
      setUserGrowth(growthData);
      setTripTrends(trendsData);
      setMatchStats(statsData);
      setPerformance(perfData);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loading size="lg" text="Loading analytics..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-muted dark:from-background dark:to-slate-900">
      <div className="container-max section-padding space-y-8">
        <div className="animate-slideInUp">
          <h1 className="text-4xl font-bold mb-2">
            Analytics Dashboard
          </h1>
          <p className="text-lg text-muted-foreground">
            Monitor platform performance and user activity
          </p>
        </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <Users className="h-8 w-8 text-blue-500" />
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
            {overview?.totalUsers.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Users</div>
          <div className="text-xs text-gray-500 mt-2">
            {overview?.activeUsersToday} active today
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <MapPin className="h-8 w-8 text-green-500" />
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
            {overview?.totalTrips.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Trips</div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <Heart className="h-8 w-8 text-pink-500" />
            <Badge variant="primary">{(matchStats?.matchRate ?? 0).toFixed(1)}%</Badge>
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
            {overview?.totalMatches.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Matches</div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <MessageCircle className="h-8 w-8 text-purple-500" />
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
            {overview?.totalChats.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Chats</div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <Activity className="h-8 w-8 text-orange-500" />
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
            {overview?.activeUsersToday.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Active Today</div>
        </Card>
      </div>

      {/* Period Selector */}
      <div className="flex gap-2">
        {['week', 'month', 'year'].map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p as typeof period)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              period === p
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {p.charAt(0).toUpperCase() + p.slice(1)}
          </button>
        ))}
      </div>

      {/* User Growth Chart */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="h-5 w-5 text-blue-500" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">User Growth</h2>
        </div>
        
        <div className="space-y-3">
          {userGrowth.map((data, index) => {
            const maxCount = Math.max(...userGrowth.map(d => d.count));
            const percentage = (data.count / maxCount) * 100;
            
            return (
              <div key={index}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {data.label}
                  </span>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">
                    {data.count}
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div
                    className="bg-blue-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Trip Trends Chart */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <MapPin className="h-5 w-5 text-green-500" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Trip Creation Trends</h2>
        </div>
        
        <div className="space-y-3">
          {tripTrends.map((data, index) => {
            const maxCount = Math.max(...tripTrends.map(d => d.count));
            const percentage = (data.count / maxCount) * 100;
            
            return (
              <div key={index}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {data.label}
                  </span>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">
                    {data.count}
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div
                    className="bg-green-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Match Statistics */}
      {matchStats && (
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <Heart className="h-5 w-5 text-pink-500" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Match Statistics</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {(matchStats.totalRequests ?? 0).toLocaleString()}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Requests</div>
            </div>
            
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {(matchStats.acceptedRequests ?? 0).toLocaleString()}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Accepted</div>
            </div>
            
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {(matchStats.rejectedRequests ?? 0).toLocaleString()}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Rejected</div>
            </div>
            
            <div>
              <div className="flex items-center gap-2">
                <div className="text-2xl font-bold text-pink-500 mb-1">
                  {((matchStats.matchRate ?? 0).toFixed(1))}%
                </div>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Match Rate</div>
            </div>
          </div>

          <div className="mt-6">
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Match Rate Progress
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
              <div
                className="bg-gradient-to-r from-pink-500 to-red-500 h-4 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(matchStats.matchRate ?? 0, 100)}%` }}
              />
            </div>
          </div>
        </Card>
      )}

      {/* System Performance */}
      {performance && (
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <Zap className="h-5 w-5 text-yellow-500" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">System Performance</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Activity className="h-5 w-5 text-blue-500" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Response Time
                </span>
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {performance.averageResponseTime}ms
              </div>
              <Badge 
                variant={performance.averageResponseTime < 200 ? 'success' : 'warning'}
                className="mt-2"
              >
                {performance.averageResponseTime < 200 ? 'Excellent' : 'Good'}
              </Badge>
            </div>
            
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-5 w-5 text-green-500" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Active Connections
                </span>
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {performance.activeConnections.toLocaleString()}
              </div>
              <Badge variant="primary" className="mt-2">Live</Badge>
            </div>
            
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Database className="h-5 w-5 text-purple-500" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Database Status
                </span>
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {performance.databaseStatus}
              </div>
              <Badge 
                variant={performance.databaseStatus === 'healthy' ? 'success' : 'warning'}
                className="mt-2"
              >
                {performance.databaseStatus === 'healthy' ? 'Healthy' : 'Check Required'}
              </Badge>
            </div>
          </div>
        </Card>
      )}
    </div>
  </div>
);
}
