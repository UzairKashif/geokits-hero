"use client"

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { auth } from '@/lib/firebaseClient'

const Dashboard = () => {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (!u) {
        router.push('/data-portal')
        return
      }
      setUser(u)
    })

    return () => unsub()
  }, [router])

  if (!user) return null

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-3xl w-full bg-white rounded shadow p-8">
        <h1 className="text-2xl font-semibold mb-4">Data Portal</h1>
        <p className="mb-6">Signed in as {user.email}</p>
        <div className="space-x-2">
          <button
            className="px-4 py-2 bg-red-600 text-white rounded"
            onClick={async () => {
              await signOut(auth)
              router.push('/data-portal')
            }}
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
