'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function RealtimeDebug() {
  const [logs, setLogs] = useState<string[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    const addLog = (message: string) => {
      const timestamp = new Date().toLocaleTimeString()
      setLogs(prev => [...prev, `[${timestamp}] ${message}`])
    }

    // addLog('Setting up realtime debug...')

    // Test basic connection
    const channel = supabase
      .channel('debug_channel')
      .on('broadcast', { event: 'test' }, (payload) => {
        addLog(`Broadcast received: ${JSON.stringify(payload)}`)
      })
      .subscribe((status) => {
        addLog(`Subscription status: ${status}`)
        setIsConnected(status === 'SUBSCRIBED')
      })

    // Test broadcast every 5 seconds
    const interval = setInterval(() => {
      if (isConnected) {
        channel.send({
          type: 'broadcast',
          event: 'test',
          payload: { message: 'test message', timestamp: Date.now() }
        })
      }
    }, 5000)

    return () => {
      clearInterval(interval)
      supabase.removeChannel(channel)
    }
  }, [])

  return (
    <div className="fixed bottom-4 right-4 bg-black text-green-400 p-4 rounded-lg text-xs max-w-md max-h-64 overflow-y-auto z-50 font-mono">
      <h4 className="font-bold mb-2">Realtime Debug</h4>
      <div className="mb-2">Status: {isConnected ? '✅ Connected' : '❌ Disconnected'}</div>
      <div className="space-y-1">
        {logs.slice(-10).map((log, index) => (
          <div key={index} className="border-b border-gray-700 pb-1">
            {log}
          </div>
        ))}
      </div>
    </div>
  )
}
