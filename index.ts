import { serve } from "https://deno.land/std@0.208.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

interface DeploymentData {
  deployment_id: string
  branch: string
  timestamp?: string
}

interface CacheEntry {
  key: string
  data: any
  expires_at: string
}

serve(async (req) => {
  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  }

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    const { deployment_id, branch, timestamp }: DeploymentData = await req.json()

    console.log(`Syncing deployment: ${deployment_id} from branch: ${branch}`)

    // 1. Log the deployment
    const { error: logError } = await supabase
      .from('security_events')
      .insert({
        event_type: 'deployment_sync',
        details: {
          deployment_id,
          branch,
          timestamp: timestamp || new Date().toISOString(),
          source: 'github_actions'
        }
      })

    if (logError) {
      console.error('Failed to log deployment:', logError)
    }

    // 2. Trigger cache refresh for frequently accessed data
    await refreshDataCache(supabase)

    // 3. Update deployment status
    const { error: statusError } = await supabase
      .from('deployment_status')
      .upsert({
        deployment_id,
        branch,
        status: 'synced',
        synced_at: new Date().toISOString()
      })

    if (statusError) {
      console.error('Failed to update deployment status:', statusError)
    }

    // 4. Cleanup old cache entries
    await cleanupExpiredCache(supabase)

    // 5. Send webhook notifications if configured
    await sendDeploymentNotifications(deployment_id, branch)

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Deployment synced successfully',
        deployment_id,
        timestamp: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Sync deployment error:', error)
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})

async function refreshDataCache(supabase: any) {
  try {
    console.log('Refreshing data cache...')

    // Cache frequently accessed hostels data
    const { data: hostels, error: hostelsError } = await supabase
      .from('hostels')
      .select('*')
      .eq('approved', true)
      .order('created_at', { ascending: false })
      .limit(50)

    if (!hostelsError && hostels) {
      await supabase
        .from('cache_entries')
        .upsert({
          cache_key: 'featured_hostels',
          data: hostels,
          expires_at: new Date(Date.now() + 60 * 60 * 1000).toISOString() // 1 hour
        })
    }

    // Cache admin statistics
    const { data: stats, error: statsError } = await supabase
      .rpc('get_admin_stats')

    if (!statsError && stats) {
      await supabase
        .from('cache_entries')
        .upsert({
          cache_key: 'admin_stats',
          data: stats,
          expires_at: new Date(Date.now() + 30 * 60 * 1000).toISOString() // 30 minutes
        })
    }

    console.log('Cache refresh completed')
  } catch (error) {
    console.error('Cache refresh failed:', error)
  }
}

async function cleanupExpiredCache(supabase: any) {
  try {
    const { error } = await supabase
      .from('cache_entries')
      .delete()
      .lt('expires_at', new Date().toISOString())

    if (error) {
      console.error('Cache cleanup failed:', error)
    } else {
      console.log('Expired cache entries cleaned up')
    }
  } catch (error) {
    console.error('Cache cleanup error:', error)
  }
}

async function sendDeploymentNotifications(deploymentId: string, branch: string) {
  try {
    // You can add webhook notifications here for Discord, Slack, etc.
    const webhookUrl = Deno.env.get('DEPLOYMENT_WEBHOOK_URL')
    
    if (webhookUrl) {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: `🚀 HOSTALL deployment successful!`,
          attachments: [{
            color: 'good',
            fields: [
              { title: 'Deployment ID', value: deploymentId, short: true },
              { title: 'Branch', value: branch, short: true },
              { title: 'Status', value: 'Synced', short: true },
              { title: 'Time', value: new Date().toISOString(), short: true }
            ]
          }]
        })
      })
    }
  } catch (error) {
    console.error('Notification send failed:', error)
  }
}