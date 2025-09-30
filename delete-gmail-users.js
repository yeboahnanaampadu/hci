require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function resetDatabase() {
  try {
    console.log('🚀 Starting complete database reset...')

    // 1. Get all users first to show what we're deleting
    const { data: users, error: listError } = await supabase.auth.admin.listUsers()
    if (listError) {
      console.error('Error listing users:', listError)
      return
    }

    console.log(`📊 Found ${users.users.length} total users to delete`)

    // 2. Delete all users (not just Gmail users)
    for (const user of users.users) {
      console.log(`🗑️  Deleting user: ${user.email} (ID: ${user.id})`)
      const { error: deleteError } = await supabase.auth.admin.deleteUser(user.id)
      if (deleteError) {
        console.error(`❌ Error deleting ${user.email}:`, deleteError)
      } else {
        console.log(`✅ Deleted ${user.email}`)
      }
    }

    // 3. Clean up all related data in public tables
    console.log('🧹 Cleaning up related data in public tables...')

    const tablesToClean = [
      'visa_applications_detailed',
      'application_status_history',
      'payments',
      'documents',
      'applicants',
      'applications',
      'profiles'
    ]

    for (const table of tablesToClean) {
      try {
        const { error: deleteError } = await supabase
          .from(table)
          .delete()
          .neq('id', '00000000-0000-0000-0000-000000000000') // Delete all rows

        if (deleteError) {
          console.error(`❌ Error cleaning ${table}:`, deleteError)
        } else {
          console.log(`✅ Cleaned ${table}`)
        }
      } catch (err) {
        console.error(`❌ Error accessing ${table}:`, err)
      }
    }

    // 4. Reset sequences
    console.log('🔄 Resetting database sequences...')
    try {
      const { error: resetError } = await supabase.rpc('reset_sequences')
      if (resetError) {
        console.log('⚠️  Could not reset sequences (function may not exist)')
      } else {
        console.log('✅ Sequences reset')
      }
    } catch (err) {
      console.log('⚠️  Could not reset sequences (function may not exist)')
    }

    console.log('🎉 Database reset complete! All users and related data deleted.')
    console.log('💡 The system is now ready for fresh user registrations.')

  } catch (err) {
    console.error('💥 Unexpected error during reset:', err)
  }
}

// Run the reset
resetDatabase()