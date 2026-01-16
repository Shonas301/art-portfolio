'use client'

import { useState, useMemo, useCallback } from 'react'
import Box from '@mui/joy/Box'
import Card from '@mui/joy/Card'
import Typography from '@mui/joy/Typography'
import Button from '@mui/joy/Button'
import Grid from '@mui/joy/Grid'
import Table from '@mui/joy/Table'
import Sheet from '@mui/joy/Sheet'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts'
import { useFlipBook } from '../context/FlipBookContext'
import { useAnalytics, AnalyticsData, PageView } from '../context/AnalyticsContext'
import { sectionMappings } from '../data/portfolio-content'

const COLORS = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe', '#43e97b', '#38f9d7']

interface SectionMetric {
  name: string
  views: number
  avgDuration: number
  totalTime: number
}

function formatDuration(ms: number): string {
  if (ms < 1000) return `${Math.round(ms)}ms`
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`
  return `${(ms / 60000).toFixed(1)}m`
}

function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleString()
}

export function AdminDashboard() {
  const { dispatch } = useFlipBook()
  const { getAnalytics, clearAnalytics } = useAnalytics()
  const [analytics, setAnalytics] = useState<AnalyticsData>(() => getAnalytics())

  const handleLogout = useCallback(() => {
    sessionStorage.removeItem('admin_authenticated')
    dispatch({ type: 'ADMIN_LOGOUT' })
  }, [dispatch])

  const handleClearData = useCallback(() => {
    if (window.confirm('Are you sure you want to clear all analytics data?')) {
      clearAnalytics()
      setAnalytics(getAnalytics())
    }
  }, [clearAnalytics, getAnalytics])

  const handleRefresh = useCallback(() => {
    setAnalytics(getAnalytics())
  }, [getAnalytics])

  const sectionMetrics = useMemo((): SectionMetric[] => {

    const allPageViews: PageView[] = analytics.sessions.flatMap((s) => s.pageViews)
    const sectionMap = new Map<string, { views: number; totalTime: number }>()

    // initialize all sections
    sectionMappings.forEach((section) => {
      sectionMap.set(section.id, { views: 0, totalTime: 0 })
    })

    // aggregate page views
    allPageViews.forEach((pv) => {
      const existing = sectionMap.get(pv.sectionId)
      if (existing) {
        existing.views++
        existing.totalTime += pv.duration
      } else {
        sectionMap.set(pv.sectionId, { views: 1, totalTime: pv.duration })
      }
    })

    return Array.from(sectionMap.entries())
      .map(([name, data]) => ({
        name,
        views: data.views,
        avgDuration: data.views > 0 ? data.totalTime / data.views : 0,
        totalTime: data.totalTime,
      }))
      .sort((a, b) => b.views - a.views)
  }, [analytics])

  const sessionsOverTime = useMemo(() => {
    // group sessions by day
    const dayMap = new Map<string, number>()

    analytics.sessions.forEach((session) => {
      const date = new Date(session.startTime).toLocaleDateString()
      dayMap.set(date, (dayMap.get(date) || 0) + 1)
    })

    return Array.from(dayMap.entries())
      .map(([date, count]) => ({ date, sessions: count }))
      .slice(-7) // last 7 days
  }, [analytics])

  const pieData = useMemo(() => {
    return sectionMetrics
      .filter((m) => m.views > 0)
      .map((m) => ({
        name: m.name,
        value: m.views,
      }))
  }, [sectionMetrics])

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
        overflow: 'auto',
        p: 3,
      }}
    >
      {/* header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Typography
          level="h2"
          sx={{ color: 'white', fontWeight: 300 }}
        >
          Analytics Dashboard
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            color="neutral"
            size="sm"
            onClick={handleRefresh}
            sx={{ borderColor: 'rgba(255,255,255,0.3)', color: 'white' }}
          >
            Refresh
          </Button>
          <Button
            variant="outlined"
            color="danger"
            size="sm"
            onClick={handleClearData}
            sx={{ borderColor: 'rgba(255,100,100,0.3)' }}
          >
            Clear Data
          </Button>
          <Button
            variant="solid"
            color="neutral"
            size="sm"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Box>
      </Box>

      {/* stats cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid xs={12} sm={6} md={3}>
          <Card
            sx={{
              backgroundColor: 'rgba(102, 126, 234, 0.2)',
              border: '1px solid rgba(102, 126, 234, 0.3)',
            }}
          >
            <Typography level="body-sm" sx={{ color: 'rgba(255,255,255,0.7)' }}>
              Total Sessions
            </Typography>
            <Typography level="h2" sx={{ color: 'white' }}>
              {analytics.sessions.length}
            </Typography>
          </Card>
        </Grid>
        <Grid xs={12} sm={6} md={3}>
          <Card
            sx={{
              backgroundColor: 'rgba(118, 75, 162, 0.2)',
              border: '1px solid rgba(118, 75, 162, 0.3)',
            }}
          >
            <Typography level="body-sm" sx={{ color: 'rgba(255,255,255,0.7)' }}>
              Total Page Views
            </Typography>
            <Typography level="h2" sx={{ color: 'white' }}>
              {analytics.totalViews}
            </Typography>
          </Card>
        </Grid>
        <Grid xs={12} sm={6} md={3}>
          <Card
            sx={{
              backgroundColor: 'rgba(240, 147, 251, 0.2)',
              border: '1px solid rgba(240, 147, 251, 0.3)',
            }}
          >
            <Typography level="body-sm" sx={{ color: 'rgba(255,255,255,0.7)' }}>
              Unique Sections Visited
            </Typography>
            <Typography level="h2" sx={{ color: 'white' }}>
              {sectionMetrics.filter((m) => m.views > 0).length}
            </Typography>
          </Card>
        </Grid>
        <Grid xs={12} sm={6} md={3}>
          <Card
            sx={{
              backgroundColor: 'rgba(79, 172, 254, 0.2)',
              border: '1px solid rgba(79, 172, 254, 0.3)',
            }}
          >
            <Typography level="body-sm" sx={{ color: 'rgba(255,255,255,0.7)' }}>
              Last Updated
            </Typography>
            <Typography level="body-md" sx={{ color: 'white' }}>
              {formatDate(analytics.lastUpdated)}
            </Typography>
          </Card>
        </Grid>
      </Grid>

      {/* charts row */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {/* page views by section */}
        <Grid xs={12} md={8}>
          <Card
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              p: 2,
            }}
          >
            <Typography level="title-lg" sx={{ color: 'white', mb: 2 }}>
              Page Views by Section
            </Typography>
            <Box sx={{ height: 250 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sectionMetrics}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 10 }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis tick={{ fill: 'rgba(255,255,255,0.7)' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1a1a2e',
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: 8,
                    }}
                    labelStyle={{ color: 'white' }}
                  />
                  <Bar dataKey="views" fill="#667eea" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Card>
        </Grid>

        {/* pie chart */}
        <Grid xs={12} md={4}>
          <Card
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              p: 2,
            }}
          >
            <Typography level="title-lg" sx={{ color: 'white', mb: 2 }}>
              Traffic Distribution
            </Typography>
            <Box sx={{ height: 250 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {pieData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1a1a2e',
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: 8,
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Card>
        </Grid>
      </Grid>

      {/* sessions over time */}
      {sessionsOverTime.length > 0 && (
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid xs={12}>
            <Card
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                p: 2,
              }}
            >
              <Typography level="title-lg" sx={{ color: 'white', mb: 2 }}>
                Sessions Over Time (Last 7 Days)
              </Typography>
              <Box sx={{ height: 200 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={sessionsOverTime}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="date" tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 10 }} />
                    <YAxis tick={{ fill: 'rgba(255,255,255,0.7)' }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1a1a2e',
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: 8,
                      }}
                      labelStyle={{ color: 'white' }}
                    />
                    <Line
                      type="monotone"
                      dataKey="sessions"
                      stroke="#764ba2"
                      strokeWidth={2}
                      dot={{ fill: '#764ba2' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* detailed table */}
      <Card
        sx={{
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          p: 2,
        }}
      >
        <Typography level="title-lg" sx={{ color: 'white', mb: 2 }}>
          Section Details
        </Typography>
        <Sheet
          sx={{
            overflow: 'auto',
            backgroundColor: 'transparent',
          }}
        >
          <Table
            sx={{
              '& th': { color: 'rgba(255,255,255,0.7)', borderColor: 'rgba(255,255,255,0.1)' },
              '& td': { color: 'white', borderColor: 'rgba(255,255,255,0.1)' },
            }}
          >
            <thead>
              <tr>
                <th>Section</th>
                <th>Views</th>
                <th>Avg Duration</th>
                <th>Total Time</th>
              </tr>
            </thead>
            <tbody>
              {sectionMetrics.map((metric) => (
                <tr key={metric.name}>
                  <td>{metric.name}</td>
                  <td>{metric.views}</td>
                  <td>{formatDuration(metric.avgDuration)}</td>
                  <td>{formatDuration(metric.totalTime)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Sheet>
      </Card>
    </Box>
  )
}
